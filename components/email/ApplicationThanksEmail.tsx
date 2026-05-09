import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components"

type Props = {
  email: string
  name: string
  school_info: string
  position: string
  motivation: string
}

const ApplicationThanksEmail = ({
  email,
  name,
  school_info,
  position,
  motivation,
}: Props) => {
  return (
    <Html>
      <Body
        style={{
          fontFamily: "sans-serif",
          backgroundColor: "#ffffff",
          color: "#222",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "32px 16px",
          }}
        >
          <Heading>
            参加応募ありがとうございます
          </Heading>

          <Text>{name} 様</Text>

          <Text>
            この度は Propositio へのご参加応募をいただき、
            誠にありがとうございます。
          </Text>

          <Text>
            以下の内容で参加応募を受け付けました。
            ご入力内容を確認後、担当者よりご連絡いたします。
          </Text>

          <Section
            style={{
              backgroundColor: "#f5f5f5",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "24px",
            }}
          >
            <Text>
              <strong>名前</strong>
              <br />
              {name}
            </Text>

            <Text>
              <strong>メールアドレス</strong>
              <br />
              {email}
            </Text>

            <Text>
              <strong>大学・学部</strong>
              <br />
              {school_info}
            </Text>

            <Text>
              <strong>希望ポジション</strong>
              <br />
              {position}
            </Text>

            <Text>
              <strong>志望理由</strong>
            </Text>

            <Section
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "6px",
                whiteSpace: "pre-wrap",
              }}
            >
              <Text>{motivation}</Text>
            </Section>
          </Section>

          <Text>
            ※ 通常3〜5日以内にご連絡いたします。
          </Text>

          <Text>
            もし心当たりのないメールの場合は、
            本メールを破棄してください。
          </Text>

          <Hr />

          <Text
            style={{
              fontSize: "14px",
              color: "#666",
            }}
          >
            Propositio AI
            <br />
            https://propositio.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ApplicationThanksEmail
