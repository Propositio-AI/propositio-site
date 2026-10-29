#!/usr/bin/env bash
set -euo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
version="$(${repository_root}/scripts/read-default.sh TF_INFRA_MODULE_VERSION "${repository_root}/config/defaults.json")"

for file in "${repository_root}/infra/terraform/env/prod/main.tf"; do
  INFRA_MODULE_VERSION="${version}" perl -0pi -e '
    s{(propositio-infra\.git//[^"?]+\?ref=)[^" ]+}{$1 . $ENV{INFRA_MODULE_VERSION}}ge
  ' "${file}"
done

printf 'propositio-infra module refを%sへ同期しました。\n' "${version}"
