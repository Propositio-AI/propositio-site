#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
expected="$(${repository_root}/scripts/read-default.sh TF_INFRA_MODULE_VERSION "${repository_root}/config/defaults.json")"

while IFS= read -r actual; do
  if [[ "${actual}" != "${expected}" ]]; then
    printf 'infra module ref mismatch: aws/main.tf uses %s; config/defaults.json requires %s\n' "${actual}" "${expected}" >&2
    exit 1
  fi
done < <(sed -nE 's/.*propositio-infra\.git\/\/.*\?ref=([^" ]+).*/\1/p' "${repository_root}/infra/terraform/aws/main.tf")
