# 共有メール機能

SESのドメインidentityはstg/prodで重複作成できないため、環境rootではなくshared stateで一度だけ管理します。

- `ses.tf`: SES configuration setとdomain identity
- `dns.tf`: DKIM、MAIL FROM、SPF、任意のDMARC
- `sns.tf`: アラーム通知先
- `cloudwatch.tf`: bounce/complaint rateアラーム
