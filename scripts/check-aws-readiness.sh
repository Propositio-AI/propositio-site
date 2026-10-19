#!/usr/bin/env bash
set -euo pipefail

repository_dir="$(cd "$(dirname "$0")/.." && pwd)"
defaults_file="$repository_dir/config/defaults.json"
read_default() { "$repository_dir/scripts/read-default.sh" "$1" "$defaults_file"; }
aws_profile="${AWS_PROFILE:-$(read_default AWS_PROFILE)}"
aws_region="${AWS_REGION:-$(read_default AWS_REGION)}"
aws_cli_version="${AWS_CLI_VERSION:-$(read_default AWS_CLI_VERSION)}"
platform_project_name="$(read_default TF_PLATFORM_PROJECT_NAME)"
platform_service_name="$(read_default TF_PLATFORM_SERVICE_NAME)"

aws_cli() {
  if command -v aws >/dev/null; then
    aws --profile "$aws_profile" --region "$aws_region" "$@"
  else
    docker run --rm -i \
      -v "$HOME/.aws:/root/.aws:ro" \
      -e AWS_PROFILE="$aws_profile" -e AWS_REGION="$aws_region" \
      "amazon/aws-cli:$aws_cli_version" "$@"
  fi
}

command -v jq >/dev/null || { echo "jq is required." >&2; exit 1; }

echo "== AWS identity"
identity_json="$(aws_cli sts get-caller-identity --output json)"
jq '.' <<<"$identity_json"

account_id="$(jq -r '.Account' <<<"$identity_json")"
platform_state="$(aws_cli s3 cp \
  "s3://${platform_project_name}-terraform-state-${account_id}/shared/terraform.tfstate" -)"
domain="${DOMAIN_NAME:-$(
  jq -er ".outputs.service_platform_config.value[\"${platform_service_name}\"].route53_zone_name" <<<"$platform_state"
)}"

echo "== SES account (${aws_region})"
account="$(aws_cli sesv2 get-account --output json)"
jq '{ProductionAccessEnabled, SendingEnabled, EnforcementStatus, SendQuota}' <<<"$account"
jq -e '.ProductionAccessEnabled == true and .SendingEnabled == true and .EnforcementStatus == "HEALTHY"' \
  <<<"$account" >/dev/null || { echo "SES account is not ready for production sending." >&2; exit 1; }

echo "== SES identity (${domain})"
identity="$(aws_cli sesv2 get-email-identity --email-identity "$domain" --output json)"
jq '{VerifiedForSendingStatus, VerificationStatus, DkimStatus: .DkimAttributes.Status, MailFromStatus: .MailFromAttributes.MailFromDomainStatus}' \
  <<<"$identity"
jq -e '.VerifiedForSendingStatus == true and .DkimAttributes.Status == "SUCCESS" and .MailFromAttributes.MailFromDomainStatus == "SUCCESS"' \
  <<<"$identity" >/dev/null || {
    echo "SES domain identity is not ready. Repair/restart Easy DKIM verification before deploying the contact form." >&2
    exit 1
  }

zone_id="$(aws_cli route53 list-hosted-zones-by-name --dns-name "$domain" --query 'HostedZones[0].Id' --output text | sed 's|/hostedzone/||')"
echo "== Route 53 hosted zone (${zone_id})"
www_cname="$(aws_cli route53 list-resource-record-sets --hosted-zone-id "$zone_id" \
  --query "ResourceRecordSets[?Name == 'www.${domain}.' && Type == 'CNAME'].ResourceRecords[0].Value | [0]" --output text)"
if [[ "$www_cname" != "None" && -n "$www_cname" ]]; then
  echo "WARNING: www.${domain} still has CNAME ${www_cname}. Remove it immediately before the prod Terraform apply; CloudFront Alias A/AAAA cannot coexist with it." >&2
fi

echo "AWS deployment readiness check passed."
