# インフラ（AWS / Terraform）とデプロイ

本番・ステージングは AWS 上で動かす。サービス固有インフラは`infra/terraform`、全サービス共通のstateバケット・GitHub OIDC・deploy Role・Cognitoは`propositio-infra`が管理し、アプリのデプロイはGitHub Actions（`.github/workflows/deploy.yml`）が行う。

AWS・Terraform・サイト基盤の既定値は`config/defaults.json`だけで管理する。TerraformはこのJSONを直接読み、Makefile・GitHub Actions・補助スクリプトも同じファイルを参照する。環境固有値、秘密値、backend設定はこのファイルへ混在させない。Web・API・追加エイリアスのドメイン名は`propositio-infra/config/defaults.json`の`TF_SERVICES.<service>.domains.<env>`が正本であり、このリポジトリでは再定義しない。

## 構成

```
                       Route53（propositio.com）
             ┌──────────────────┴──────────────────┐
propositio.com / www.propositio.com / stg.propositio.com   api.propositio.com / api.stg.propositio.com
             │                                      │
        CloudFront（OAC・セキュリティヘッダー）       ALB（HTTPS・ACM）
             │                                      │  public subnet ×2AZ
        S3（非公開。apps/web のビルド成果物）     ECS Fargate（FastAPI）── SES（送信のみ）
                                                    │  private subnet ×2AZ
                                                 RDS PostgreSQL 16

   運営の受信・返信：info@propositio.com。既存のMXは変更しない
```

| 役割 | サービス | 補足 |
| --- | --- | --- |
| Web 配信 | S3 + CloudFront | 非公開バケットを OAC で配信。`www.propositio.com`は`propositio.com`へ301リダイレクトし、SPA のルーティングは CloudFront Function で`index.html`に書き換える。HSTS・CSP などのセキュリティヘッダーを付与 |
| API | ECS（Fargate）+ ALB | タスクはパブリックサブネットに置き、パブリック IP で外部 API（microCMS・SES・Turnstile）へ出る。受信はセキュリティグループで ALB からのみ許可（NAT Gateway なし） |
| DB | RDS PostgreSQL 16 | インターネットへの経路がないプライベートサブネット。TLS 必須、暗号化、自動バックアップ |
| 秘密値 | サービス固有SSM Parameter Store + KMS | `propositio-site`が環境別KMS keyと`alias/karynos-<env>-parameters`を所有し、`/propositio/<env>/propositio-site/`以下へDB・microCMS・Turnstileの値を分離して保存 |
| メール送信 | SES | DKIM・カスタム MAIL FROM で認証。タスクロールで「決められた送信元アドレスでの送信」だけを許可 |
| DNS・証明書 | Route53 + ACM | 証明書は DNS 検証で自動発行・自動更新 |
| CI/CD | GitHub Actions（OIDC） | OIDC Providerとdeploy Roleは`propositio-infra`が所有。長期Access Keyは置かない |
| 監視 | CloudWatch Alarms + SNS | API の 5xx・異常タスク、RDS の CPU・空き容量、SES のバウンス率・苦情率 |

### 環境

| | stg | prod |
| --- | --- | --- |
| Web | `stg.<domain>`（`noindex`） | `<domain>`（正規URL）、`www.<domain>`（301転送） |
| API | `api.stg.<domain>` | `api.<domain>` |
| API タスク | 1〜2 | 1〜2（可用性が必要になったら下限を2へ上げる） |
| RDS | db.t4g.micro、バックアップ1日、削除保護なし | db.t4g.micro、バックアップ7日、削除保護・最終スナップショットあり |
| ログ保持 | 30日 | 90日 |
| デプロイ | main へのマージで自動 | 手動実行＋承認（stg で検証済みのイメージを昇格） |

全環境共通のサイズを変えるときは`config/defaults.json`、stg/prod固有の台数・保持期間・保護設定を変えるときは`envs/<env>/main.tf`を編集する。RDSをマルチAZにする場合は、prodの`db_multi_az`を環境固有値として上書きする（費用は約2倍）。

## ディレクトリ

```
infra/terraform/
├── backend.hcl.example   # remote state の設定（bucket 名）。backend.hcl にコピーして使う（コミットしない）
├── bootstrap/            # propositio-infraの共通stateバケットが存在するか確認（作成しない）
├── shared/               # propositio-site固有のECR・SES（ドメイン認証）
├── modules/environment/  # 1環境分の構成（VPC・ALB・ECS・RDS・CloudFront・Route53・IAM・アラーム）
└── envs/
    ├── stg/              # module "environment" を stg のサイズで呼ぶ
    └── prod/             # 同 prod
```

- state は S3 に置き、S3 ネイティブのロック（`use_lockfile`）で同時実行を防ぐ。
- ドメインは`propositio-infra`へのサービス登録時に確定し、siteのshared/stg/prodは共有remote stateの`service_platform_config` から自動取得する。
- microCMSドメインや初回イメージタグなどサービス固有の値は、各ルートの`terraform.tfvars`（`.example`をコピー。コミットしない）に書く。
- site共有リソースは`make shared-plan-aws`、環境ごとのリソースは`make plan-aws ENV=stg|prod`で保存planを作る。レビュー後、それぞれ`make shared-apply-aws`、`make apply-aws ENV=stg|prod`で確認済みplanだけを適用する。削除は確認文字列とstateバックアップを必須にした専用ターゲットを使う。

## 初回構築

前提：

- AWS CLI で対象アカウントにログインしている（`aws sso login` など）。
- `propositio-infra`のsharedが適用済みで、`TF_SERVICES.propositio-site`と`service_platform_config`が存在する。siteのTerraformはこのstateを読むため、先にsiteだけを適用できない。
- Terraform 1.11 以上（DB パスワードを state に残さない write-only 属性を使う）。
- ドメインの Route53 ホストゾーンが存在する（Route53 で登録したドメインなら自動で作られる。他社で登録した場合はホストゾーンを作り、レジストラの NS を向ける）。
- 既存のメール受信用 DNS レコード（MX・SPF など）はそのまま残る。Terraform が追加するのは、Web・API の A/AAAA、証明書の検証、SES の DKIM・MAIL FROM（`mail.<domain>`）のレコード。
- 初回prod適用前に、旧ホスティング用の`www.propositio.com CNAME`を削除する。Terraformが同名のCloudFront Alias A/AAAAを作るため、CNAMEとは共存できない。

### 1. 共通基盤の出力を取得する

`propositio-infra`で`propositio-site`の接続情報を確認します。

```bash
make service-config SERVICE=propositio-site
```

このリポジトリではstateバケット、GitHub OIDC Provider、deploy Roleを作成しません。接続確認が必要な場合だけ次を実行します。

```bash
cd infra/terraform/bootstrap
terraform init && terraform apply
```

`infra/terraform/backend.hcl.example`を`backend.hcl`へコピーし、`service_platform_config.state.bucket`を設定します。

```bash
cd infra/terraform
cp backend.hcl.example backend.hcl
```

### 2. 共有リソース（shared）

```bash
cp infra/terraform/shared/terraform.tfvars.example infra/terraform/shared/terraform.tfvars
# 必要な場合はDMARC・アラーム宛先を編集
make shared-plan-aws
# 保存されたplanを確認してから適用
make shared-apply-aws
```

DMARC を既存DNSで設定済みでない場合は、`dmarc_record` を指定すると作成される。

### 3. SES の本番利用申請

作成直後の SES は「サンドボックス」で、認証済みのアドレス（このドメインのアドレス）にしか送れない。自動返信は任意のアドレスに送るため、AWS コンソールの SES →「アカウントダッシュボード」から**本番アクセスをリクエスト**する（用途：Web サイトのお問い合わせへの受付通知、想定通数、バウンス・苦情の対処方法を記載）。通常1日程度で承認される。

本番のメール経路は次のとおり。

- 送信元：`noreply@propositio.com`（SESで送信）
- 運営通知先：`info@propositio.com`
- 運営通知のReply-To：フォームに入力されたメールアドレス
- 自動返信のReply-To：`info@propositio.com`

SESの本番アクセスはリージョン単位であるため、Terraformと同じ `ap-northeast-1` で申請する。申請承認後、任意の外部アドレスへの自動返信が可能になる。

動作確認では`aws sesv2 get-email-identity --email-identity propositio.com`の`VerifiedForSendingStatus`とDKIMの`Status`が成功であることを確認する。DNSレコードが存在しても`FAILED`のままなら、Easy DKIMの検証を再開始し、表示された3件のCNAMEをRoute 53へ反映してから再確認する。送信テストは`noreply@propositio.com`から`info@propositio.com`へ行う。

### 4. 最初のイメージを ECR に push

環境の作成にはイメージが必要なため、一度だけ手元から push する（以降は GitHub Actions が行う）。

```bash
make push-api-image
```

このコマンドはsharedのTerraform outputからECR URLを取得し、現在のGitコミットSHAをタグにして`services/backend/Dockerfile`の`prod`ターゲットを`linux/amd64`向けにビルド・pushする。同じSHAが既にECRにあれば再pushしない。最後に表示される`API_IMAGE_TAG`を環境別`terraform.tfvars`へ設定する。

### 5. 環境（stg → prod）

```bash
cp infra/terraform/envs/stg/terraform.tfvars.example infra/terraform/envs/stg/terraform.tfvars
# terraform.tfvars の api_image_tag に手順4の TAG を記入
make plan-aws ENV=stg
# 保存されたplanを確認してから適用
make apply-aws ENV=stg
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

prodも`terraform.tfvars`を作り、`make plan-aws ENV=prod`、`make apply-aws ENV=prod`の順で適用する。

### 6. GitHub の設定

1. リポジトリの Settings → Environments で `stg` と `prod` を作る。`prod` には **Required reviewers** を設定する（承認なしに本番へデプロイできないようにする）。
2. 各 Environment に、`terraform output github_environment_variables` の値を **Variables** として登録する。GitHub CLI なら次でまとめて登録できる。

   ```
   cd infra/terraform/envs/stg
   terraform output -json github_environment_variables \
     | jq -r 'to_entries[] | "\(.key)=\(.value)"' \
     | while IFS='=' read -r k v; do gh variable set "$k" --env stg --body "$v"; done
   ```

3. `propositio-infra`の`service_platform_config.github_deploy_role_arn.stg/prod`を、各Environmentの`AWS_DEPLOY_ROLE_ARN`へ登録する。この値はサイトTerraformのoutputには含めない。
4. Turnstile を使う場合は、`VITE_TURNSTILE_SITE_KEY`（サイトキー。公開してよい値）も各 Environment の Variables に登録する。

## 旧構成から共通基盤への移行

既存のsite専用stateバケット・OIDC Provider・deploy RoleをAWSへ適用済みの場合、いきなり削除しません。

1. すべてのTerraform stateを`terraform state pull`でバックアップする。
2. AWSに既存GitHub OIDC Providerがある場合は、先に`propositio-infra`のbootstrap stateへimportする。
3. `propositio-infra`のsharedを適用し、`propositio-site`用deploy Roleを作る。
4. GitHubの`AWS_DEPLOY_ROLE_ARN`を新Roleへ切り替え、stgデプロイを確認する。
5. `terraform init -migrate-state`でsiteのshared/stg/prod stateを共通bucketの`services/propositio-site/...`へ移す。
6. site側Terraformをplanし、OIDC Providerや旧Role以外の意図しない削除がないことを確認する。
7. 移行完了後に旧Roleと空になった旧stateバケットを別作業で廃止する。

Terraform内の`removed` blockは旧OIDC Providerと旧Roleを削除せずstateから外します。AWS上の削除は、新Roleでのデプロイとstate移行を確認してから行います。

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

```bash
make plan-aws ENV=stg
# 保存されたplanを確認してから
make apply-aws ENV=stg
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
| ECS Fargate（0.25vCPU / 0.5GB） | 約 $10（1タスク） | 約 $10（1タスク） |
| RDS db.t4g.micro + 20GB | 約 $18 | 約 $18（マルチAZで約2倍） |
| パブリック IPv4（タスク・ALB） | 約 $10 | 約 $15 |
| その他（CloudFront・S3・Route53・Secrets Manager・SES・CloudWatch） | 数ドル | 数ドル |

NAT Gateway（約 $45/月）を使わない分を、タスクをパブリックサブネットに置くことで削っている。

この構成をPropositio AIのECSネットワーク標準とする。通常のECS Serviceとデプロイ時のmigration taskはどちらもTerraform outputのpublic subnetを使い、`ECS_ASSIGN_PUBLIC_IP=ENABLED`で起動する。API Security GroupはALBからのコンテナポート通信だけを許可し、RDSはprivate subnetから外へ出さない。ECSは1 task、RDSはSingle-AZ、Container Insightsは無効から始め、可用性や詳細監視が必要になった時点で増強する。

## まだ入れていないもの（必要になったら追加する）

- **ALB・CloudFront のアクセスログ**：S3 にログ用バケットを作って有効にする。
- **AWS WAF**：フォームへの大量送信などが問題になったら、CloudFront / ALB に付ける。
- **VPC フローログ・GuardDuty・Security Hub**：組織のセキュリティ基準に合わせて有効にする。
- **Terraform の CI 実行**：今は人が `plan` / `apply` する。PR で `plan` を自動実行する場合は、読み取り専用のロールを別に作る。
