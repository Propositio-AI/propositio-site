# インフラ（AWS / Terraform）とデプロイ

本番・ステージングは AWS 上で動かす。インフラは `infra/terraform` の Terraform で管理し、アプリのデプロイは GitHub Actions（`.github/workflows/deploy.yml`）が行う。

## 構成

```
                       Route53（propositio.com）
             ┌──────────────────┴──────────────────┐
propositio.com / stg.propositio.com   api.propositio.com / api.stg.propositio.com
             │                                      │
        CloudFront（OAC・セキュリティヘッダー）       ALB（HTTPS・ACM）
             │                                      │  public subnet ×2AZ
        S3（非公開。apps/web のビルド成果物）     ECS Fargate（FastAPI）── SES（送信のみ）
                                                    │  private subnet ×2AZ
                                                 RDS PostgreSQL 16

   運営の受信・返信：Google Workspace（Gmail）。MX は Google のまま
```

| 役割 | サービス | 補足 |
| --- | --- | --- |
| Web 配信 | S3 + CloudFront | 非公開バケットを OAC で配信。SPA のルーティングは CloudFront Function で `index.html` に書き換える。HSTS・CSP などのセキュリティヘッダーを付与 |
| API | ECS（Fargate）+ ALB | タスクはパブリックサブネットに置き、パブリック IP で外部 API（microCMS・SES・Turnstile）へ出る。受信はセキュリティグループで ALB からのみ許可（NAT Gateway なし） |
| DB | RDS PostgreSQL 16 | インターネットへの経路がないプライベートサブネット。TLS 必須、暗号化、自動バックアップ |
| 秘密値 | Secrets Manager | DB パスワード（Terraform がstateに残さず生成）と、アプリの秘密値（microCMS・Turnstile） |
| メール送信 | SES | DKIM・カスタム MAIL FROM で認証。タスクロールで「決められた送信元アドレスでの送信」だけを許可 |
| DNS・証明書 | Route53 + ACM | 証明書は DNS 検証で自動発行・自動更新 |
| CI/CD | GitHub Actions（OIDC） | 長期のアクセスキーを GitHub に置かない |
| 監視 | CloudWatch Alarms + SNS | API の 5xx・異常タスク、RDS の CPU・空き容量、SES のバウンス率・苦情率 |

### 環境

| | stg | prod |
| --- | --- | --- |
| Web | `stg.<domain>`（`noindex`） | `<domain>` |
| API | `api.stg.<domain>` | `api.<domain>` |
| API タスク | 1〜2 | 2〜4（2AZに分散） |
| RDS | db.t4g.micro、バックアップ1日、削除保護なし | db.t4g.micro、バックアップ7日、削除保護・最終スナップショットあり |
| ログ保持 | 30日 | 90日 |
| デプロイ | main へのマージで自動 | 手動実行＋承認（stg で検証済みのイメージを昇格） |

サイズを変えるときは `envs/<env>/main.tf` を編集する。RDS をマルチAZにする場合は prod の `db_multi_az = true`（費用は約2倍）。

## ディレクトリ

```
infra/terraform/
├── backend.hcl.example   # remote state の設定（bucket 名）。backend.hcl にコピーして使う（コミットしない）
├── bootstrap/            # state 用 S3 バケット（アカウントに1回・ローカル state）
├── shared/               # ECR・SES（ドメイン認証）・GitHub OIDC プロバイダー（アカウントに1つ）
├── modules/environment/  # 1環境分の構成（VPC・ALB・ECS・RDS・CloudFront・Route53・IAM・アラーム）
└── envs/
    ├── stg/              # module "environment" を stg のサイズで呼ぶ
    └── prod/             # 同 prod
```

- state は S3 に置き、S3 ネイティブのロック（`use_lockfile`）で同時実行を防ぐ。
- ドメイン名や GitHub リポジトリ名などアカウント固有の値は、各ルートの `terraform.tfvars`（`.example` をコピー。コミットしない）に書く。
- 実 AWS への `plan` / `apply` は誤適用を防ぐため Makefile に用意しておらず、手動で実行する。`make infra-fmt` / `make infra-validate` はクラウドに接続しない。

## 初回構築

前提：

- AWS CLI で対象アカウントにログインしている（`aws sso login` など）。
- Terraform 1.11 以上（DB パスワードを state に残さない write-only 属性を使う）。
- ドメインの Route53 ホストゾーンが存在する（Route53 で登録したドメインなら自動で作られる。他社で登録した場合はホストゾーンを作り、レジストラの NS を向ける）。
- 既存の DNS レコード（Google Workspace の MX・SPF など）はそのまま残る。Terraform が追加するのは、Web・API の A/AAAA、証明書の検証、SES の DKIM・MAIL FROM（`mail.<domain>`）のレコード。

### 1. state バケット（bootstrap）

```
cd infra/terraform/bootstrap
cp terraform.tfvars.example terraform.tfvars   # project_name を編集
terraform init && terraform apply
cd .. && cp backend.hcl.example backend.hcl    # 出力された state_bucket を記入
```

### 2. 共有リソース（shared）

```
cd infra/terraform/shared
cp terraform.tfvars.example terraform.tfvars   # domain_name などを編集
terraform init -backend-config=../backend.hcl
terraform apply
```

DMARC を Google Workspace 側で設定済みでない場合は、`dmarc_record` を指定すると作成される。

### 3. SES の本番利用申請

作成直後の SES は「サンドボックス」で、認証済みのアドレス（このドメインのアドレス）にしか送れない。自動返信は任意のアドレスに送るため、AWS コンソールの SES →「アカウントダッシュボード」から**本番アクセスをリクエスト**する（用途：Web サイトのお問い合わせへの受付通知、想定通数、バウンス・苦情の対処方法を記載）。通常1日程度で承認される。

本番のメール経路は次のとおり。

- 送信元：`noreply@propositio.com`（SESで送信）
- 運営通知先：`info@propositio.com`（Google Workspaceで受信）
- 運営通知のReply-To：フォームに入力されたメールアドレス
- 自動返信のReply-To：`info@propositio.com`

SESの本番アクセスはリージョン単位であるため、Terraformと同じ `ap-northeast-1` で申請する。申請承認後、任意の外部アドレスへの自動返信が可能になる。

### 4. 最初のイメージを ECR に push

環境の作成にはイメージが必要なため、一度だけ手元から push する（以降は GitHub Actions が行う）。

```
REPO=$(cd infra/terraform/shared && terraform output -raw ecr_repository_url)
TAG=$(git rev-parse HEAD)
aws ecr get-login-password | docker login --username AWS --password-stdin "${REPO%%/*}"
docker build --platform linux/amd64 --target prod -t "$REPO:$TAG" services/backend
docker push "$REPO:$TAG"
```

### 5. 環境（stg → prod）

```
cd infra/terraform/envs/stg
cp terraform.tfvars.example terraform.tfvars   # api_image_tag に手順4の TAG を記入
terraform init -backend-config=../../backend.hcl
terraform apply
```

続けて、アプリの秘密値をSSM Parameter Storeへ設定し、APIを再起動する（初期値のままだと活動記録が取得できない）。

```
PREFIX="$(terraform output -raw app_parameter_prefix)"
aws ssm put-parameter --name "$PREFIX/app/microcms-api-key" \
  --type SecureString --value '<APIキー>' --overwrite
aws ssm put-parameter --name "$PREFIX/app/turnstile-secret-key" \
  --type SecureString --value 'disabled' --overwrite
aws ecs update-service --cluster <project>-stg --service <project>-stg-api --force-new-deployment
```

`TURNSTILE_SECRET_KEY` は Turnstile を使う場合にシークレットキーを入れる（`disabled` のままなら検証しない）。値はシェルの履歴に残るため、気になる場合はコンソールから設定する。

prod も同じ手順で `envs/prod` に適用する。

### 6. GitHub の設定

1. リポジトリの Settings → Environments で `stg` と `prod` を作る。`prod` には **Required reviewers** を設定する（承認なしに本番へデプロイできないようにする）。
2. 各 Environment に、`terraform output github_environment_variables` の値を **Variables** として登録する。GitHub CLI なら次でまとめて登録できる。

   ```
   cd infra/terraform/envs/stg
   terraform output -json github_environment_variables \
     | jq -r 'to_entries[] | "\(.key)=\(.value)"' \
     | while IFS='=' read -r k v; do gh variable set "$k" --env stg --body "$v"; done
   ```

3. Turnstile を使う場合は、`VITE_TURNSTILE_SITE_KEY`（サイトキー。公開してよい値）も各 Environment の Variables に登録する。

## デプロイ（`.github/workflows/deploy.yml`）

| トリガー | 動作 |
| --- | --- |
| main への push で CI が成功 | stg へ自動デプロイ |
| Actions →「Deploy」→「Run workflow」で `prod` を選択 | 承認後に prod へデプロイ |

1回のデプロイで行うこと：

1. コミット SHA をタグにした API イメージを用意する（stg：無ければビルドして push / prod：stg でビルド済みのものを使う。無ければ失敗）。
2. タスク定義の最新リビジョンを元に、イメージだけ差し替えた新リビジョンを登録する。
3. そのリビジョンで一度だけタスクを起動し、`alembic upgrade head` を実行する。失敗したらここで中止する（サービスは旧バージョンのまま）。
4. ECS サービスをローリング更新する。新しいタスクがヘルスチェックに通らない場合は、ECS のサーキットブレーカーが前のリビジョンへ自動で戻す。
5. Web をビルドして S3 にアップロードし、CloudFront の `index.html` のキャッシュを無効化する。

マイグレーションは、旧バージョンの API が動いている状態で先に適用される。列の削除・名前変更など旧コードと互換性のない変更は、「追加 → コード切り替え → 削除」のように複数回のデプロイに分ける。

### ロールバック

Actions →「Deploy」→「Run workflow」で、戻したいコミットの SHA を `ref` に指定して実行する（イメージは ECR に直近50件残っている）。DB マイグレーションは自動では戻らないため、必要なら `alembic downgrade` を別途実行する。

## 日々の運用

### インフラの変更

```
cd infra/terraform/envs/stg
terraform plan     # 差分を確認してから
terraform apply
```

タスク定義の環境変数・秘密値の参照・CPU/メモリを変えた場合、Terraform は新しいリビジョンを登録するだけでサービスには反映しない（タスク定義はデプロイの管理下）。次回のデプロイで反映されるので、すぐに反映したいときは Deploy ワークフローを実行する。

### 秘密値の変更

`aws ssm put-parameter --overwrite` で更新し、`aws ecs update-service ... --force-new-deployment` でタスクを入れ替える（値はタスク起動時に読み込まれる）。

DB パスワードを入れ替える場合は、`envs/<env>/main.tf` の module に `db_password_version = 2` のように値を上げて apply し、その後タスクを入れ替える。

### コンテナ・DB の調査

ECS Exec で稼働中のコンテナに入れる（Session Manager プラグインが必要）。

```
aws ecs execute-command --cluster <project>-stg --task <タスクID> --container api --interactive --command "sh"
```

DB はプライベートサブネットにあり外から直接は接続できない。調査はコンテナ内から `python` / `alembic` で行う。

### ログ

- API：CloudWatch Logs の `/ecs/<project>-<env>/api`
- RDS：`/aws/rds/instance/<project>-<env>/postgresql`（1秒以上のクエリ）

### アラーム

`alarm_email` を指定すると、SNS から確認メールが届く（リンクを開くまで通知されない）。

## 費用の目安（東京リージョン・月額・概算）

| リソース | stg | prod |
| --- | --- | --- |
| ALB | 約 $20 | 約 $20 |
| ECS Fargate（0.25vCPU / 0.5GB） | 約 $10（1タスク） | 約 $20（2タスク） |
| RDS db.t4g.micro + 20GB | 約 $18 | 約 $18（マルチAZで約2倍） |
| パブリック IPv4（タスク・ALB） | 約 $10 | 約 $15 |
| その他（CloudFront・S3・Route53・Secrets Manager・SES・CloudWatch） | 数ドル | 数ドル |

NAT Gateway（約 $45/月）を使わない分を、タスクをパブリックサブネットに置くことで削っている。

## まだ入れていないもの（必要になったら追加する）

- **ALB・CloudFront のアクセスログ**：S3 にログ用バケットを作って有効にする。
- **AWS WAF**：フォームへの大量送信などが問題になったら、CloudFront / ALB に付ける。
- **VPC フローログ・GuardDuty・Security Hub**：組織のセキュリティ基準に合わせて有効にする。
- **Terraform の CI 実行**：今は人が `plan` / `apply` する。PR で `plan` を自動実行する場合は、読み取り専用のロールを別に作る。
