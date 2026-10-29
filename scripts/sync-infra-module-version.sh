#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
version="$(${repository_root}/scripts/read-default.sh TF_INFRA_MODULE_VERSION "${repository_root}/config/defaults.json")"

INFRA_MODULE_VERSION="${version}" perl -0pi -e '
  s{(propositio-infra\.git//[^"?]+\?ref=)[^" ]+}{$1 . $ENV{INFRA_MODULE_VERSION}}ge
' "${repository_root}/infra/terraform/aws/main.tf"

printf 'propositio-infra module refを%sへ同期しました。\n' "${version}"
