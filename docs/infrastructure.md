# インフラ（Terraform / Floci）

`infra/terraform`はAWS基盤の土台。**同じTerraformコードを実AWSとFloci（ローカルのAWS互換エミュレータ）の両方に適用する**ため、ローカルで確認した構成をそのまま実AWSへ持っていける。

通常のアプリ開発（`docker-compose.yml`: PostgreSQL + FastAPI + Web）とは独立している。backendは現時点でAWSに接続しないため、ここで作るリソースはアプリからAWSを使う機能（認証・ファイル保存など）を追加するときの土台になる。

## 作成するリソース

| ファイル | リソース | 内容 |
| --- | --- | --- |
| `auth.tf` | Cognito User Pool | メールアドレスでサインイン、メール確認コード（`CONFIRM_WITH_CODE`）で検証、MFAはTOTP（認証アプリ）を任意（`OPTIONAL`）、パスワードポリシー、メールでのアカウント復旧、削除保護（実AWS） |
| `auth.tf` | User Pool Client × 2（`web` / `mobile`） | client secretなしのpublic client。認証フローはSRP + リフレッシュトークンのみ、トークン失効を有効化。`cognito_callback_urls`を渡したときだけOAuth（Authorization Code）を有効化 |
| `storage.tf` | S3バケット | 非公開（Public Access Block全有効）、バージョニング有効、SSE-S3（AES256）暗号化、ACL無効化（`BucketOwnerEnforced`） |
| `storage.tf` | DynamoDBテーブル | `pk` / `sk`の汎用キー、オンデマンド（`PAY_PER_REQUEST`）、AWSマネージドKMSキーで暗号化、PITRは変数で切り替え、削除保護（実AWS） |
| `locals.tf` | `random_id` | S3バケット名の衝突を避ける8桁の16進接尾辞 |

命名は`<project_name>-<environment>`（例: `app-local`）を接頭辞にする。S3バケットは`<接頭辞>-app-<random suffix>`、DynamoDBテーブルは`<接頭辞>-app`。

すべてのリソースにproviderの`default_tags`で`Project` / `Environment` / `ManagedBy=terraform`（と`extra_tags`）が付く。

## 変数

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `project_name` | （必須） | リソース名の接頭辞。小文字英字で始まる3〜24文字の小文字英数字・ハイフン |
| `environment` | （必須） | 環境名（`local` / `dev` / `prod`など）。小文字英字で始まる2〜10文字の小文字英数字 |
| `aws_region` | `ap-northeast-1` | リージョン |
| `aws_endpoint_url` | `null` | Flociのエンドポイント。`null`なら実AWS |
| `extra_tags` | `{}` | 追加のタグ |
| `cognito_callback_urls` / `cognito_logout_urls` | `[]` | OAuth（Hosted UI / 外部IdP）を使うときのURL。空ならOAuthは無効 |
| `cognito_deletion_protection` | `true` | User Poolの削除保護（Flociでは常に無効） |
| `s3_force_destroy` | `false` | オブジェクトが残っていてもバケットを削除できるようにするか |
| `dynamodb_point_in_time_recovery` | `true` | DynamoDBのPITR |
| `dynamodb_deletion_protection` | `true` | DynamoDBの削除保護（Flociでは常に無効） |

出力（`make infra-output` / `terraform output`）: `aws_region`、`aws_endpoint_url`、`name_prefix`、`cognito_user_pool_id`、`cognito_user_pool_arn`、`cognito_web_client_id`、`cognito_mobile_client_id`、`s3_bucket_name`、`s3_bucket_arn`、`dynamodb_table_name`、`dynamodb_table_arn`。

## ローカル（Floci）で動かす

[Floci](https://floci.io/)はAWS APIを再現するオープンソースのエミュレータ（LocalStack互換のエンドポイント・ヘルスチェックを持つ）。`infra/floci/docker-compose.yml`で`floci/floci:2.1.0`を起動する。

```bash
make floci-up        # Floci（http://localhost:4566）を起動し、ヘルスチェックが通るまで待つ
make floci-health    # サービスごとの状態（curl http://localhost:4566/_localstack/health）
make plan-floci      # 差分を確認する
make apply-floci     # 適用する（確認プロンプトを省く場合: make apply-floci ARGS=-auto-approve）
make infra-output    # User Pool ID・Client ID・バケット名などを表示する
make destroy-floci   # 作成したリソースを削除する
make floci-down      # Flociを停止する（リソースはボリュームに保持される）
make floci-down-v    # Flociを停止し、ボリュームごと削除する
make floci-logs      # Flociのログを追跡表示する
```

- `plan-floci` / `apply-floci` / `destroy-floci`は、`floci-health`（Flociが起動しているか）と`infra-init`を先に実行する。
- `infra-init`は`terraform init -reconfigure -backend-config=path=floci.tfstate`。Floci用のstateは`infra/terraform/floci.tfstate`（gitignore対象）に保存され、実AWS用のstateとは混ざらない。
- ホストに`terraform`があればそれを使い、無ければ`hashicorp/terraform:$(TF_VERSION)`のDockerイメージで実行する。Dockerで実行する場合、Flociへは`http://host.docker.internal:4566`で接続する（Makefileが`aws_endpoint_url`を自動で上書きする）。
- 認証情報はproviderがFloci用のダミー値（`test` / `test`）を使うので、AWSの認証情報は不要。
- FlociのComposeプロジェクト名は`<リポジトリのディレクトリ名>-floci`（`FLOCI_PROJECT_NAME`で変更可）。ポート4566は固定のため、Flociを使う複数のプロジェクトを同時には起動できない。

### Flociの設定（`infra/floci/docker-compose.yml`）

| 設定 | 値 | 理由 |
| --- | --- | --- |
| `image` | `floci/floci:2.1.0` | 再現性のため固定。更新時はリリースノートを確認する |
| `FLOCI_DEFAULT_REGION` | `${FLOCI_DEFAULT_REGION:-ap-northeast-1}` | `envs/floci.tfvars`の`aws_region`と揃える |
| `FLOCI_STORAGE_MODE` | `persistent` | `docker compose down`してもリソースを保持する |
| `FLOCI_STORAGE_PERSISTENT_PATH` | `/app/data`（名前付きボリューム`floci_data`） | 公式ドキュメントの推奨パス |
| ヘルスチェック | イメージ同梱の`healthcheck.sh` | `make floci-up`は`--wait`でhealthyになるまで待つ |
| Dockerソケット | マウントしない | Lambda / RDSなどコンテナを起動するサービスを使わないため不要 |

### Flociと実AWSの差分の扱い

本番向けの定義を弱めないことを優先し、Floci向けの切り替えは`providers.tf`と`local.is_floci`に閉じ込めている。

| 項目 | 実AWS | Floci | 実装 |
| --- | --- | --- | --- |
| エンドポイント | AWS既定 | `aws_endpoint_url` | `providers.tf`の`dynamic "endpoints"`（cognitoidp / dynamodb / s3 / sts） |
| 認証情報・検証 | 標準の認証チェーン | ダミー値、認証情報・リージョン・アカウントIDの検証をskip | `providers.tf`の`skip_*` |
| S3のアドレス形式 | 仮想ホスト形式 | パス形式 | `s3_use_path_style` |
| 削除保護（Cognito / DynamoDB） | 変数どおり（既定: 有効） | 常に無効（作り直しやすさのため） | `!local.is_floci && var.xxx_deletion_protection` |
| `s3_force_destroy` / PITR | 既定: `false` / `true` | `envs/floci.tfvars`で`true` / `false` | tfvars |
| パスワードポリシーの記号必須 | `true` | Flociは`false`を保存しないため、`true`に統一して差分が出ないようにしている | `auth.tf` |

Floci 2.1.0で `plan → apply → plan（No changes）→ Floci再起動後のplan（No changes。永続化の確認）→ PITR切り替え → destroy` が通ることを確認している。Flociのバージョンを上げたときは同じ流れで確認する。Flociの各サービスの対応範囲は公式ドキュメント（https://floci.io/floci/services/）を参照。

## 実AWSへ適用する

Makefileには実AWS向けのapplyターゲットを用意していない（Floci向けとの取り違えを防ぐため）。以下を手動で実行する。

```bash
cd infra/terraform

# 1. 変数ファイルを作る（*.tfvars はgitignore対象。秘密値は書かない）
cp envs/aws.tfvars.example envs/dev.tfvars
#    project_name / environment / aws_region などを編集する

# 2. 認証（例: IAM Identity Center）
export AWS_PROFILE=<プロファイル名>
aws sso login

# 3. 初期化（Floci用とは別のstateを使う）
terraform init -reconfigure -backend-config=path=dev.tfstate

# 4. 確認して適用
terraform plan -var-file=envs/dev.tfvars
terraform apply -var-file=envs/dev.tfvars
terraform output
```

- `infra/terraform`ではFloci用と実AWS用で`terraform init -reconfigure`の`path`を切り替えるため、Floci操作（`make plan-floci`等）の後に実AWSを操作するときは必ず`init`をやり直す。
- チームで運用する実AWS環境では、ローカルstateではなくS3 backend（stateロック付き）を使う。`versions.tf`の`backend "local" {}`を次のように置き換え、`-backend-config`でバケット等を渡す。

  ```hcl
  backend "s3" {}
  ```

  ```bash
  terraform init -reconfigure \
    -backend-config="bucket=<stateを置くバケット>" \
    -backend-config="key=<project_name>/<environment>.tfstate" \
    -backend-config="region=ap-northeast-1" \
    -backend-config="use_lockfile=true"
  ```

  この場合、Flociでも同じbackend種別が必要になるため、Floci用のinitもS3 backend（Floci上のバケット）に合わせて変更する。
- 本番運用ではCognitoのメール送信を`COGNITO_DEFAULT`（送信数に上限あり）からSESへ切り替える（`auth.tf`の`email_configuration`）。
- `deletion_protection`が有効なリソースを削除するときは、先に変数で無効化してapplyする。

## 検証（CI）

```bash
make infra-fmt       # terraform fmt -recursive
make infra-validate  # fmt -check → init -backend=false → validate
```

CIの`Terraform`ジョブは`make infra-validate`を実行する（クラウドへの接続・認証情報は不要）。providerのバージョンは`infra/terraform/.terraform.lock.hcl`で固定している（linux / darwin / windowsのハッシュを記録済み）。providerを更新したら次でロックファイルを更新してコミットする。

```bash
cd infra/terraform
terraform init -upgrade -backend=false
terraform providers lock -platform=linux_amd64 -platform=linux_arm64 -platform=darwin_amd64 -platform=darwin_arm64 -platform=windows_amd64
```
