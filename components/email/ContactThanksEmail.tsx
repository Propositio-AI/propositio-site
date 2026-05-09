import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
} from "@react-email/components";

type Props = {
  email: string;
  title: string;
  content: string;
};

const ContactThanksEmail = ({ email, title, content }: Props) => {
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
            お問い合わせありがとうございます
          </Heading>

          <Text>{email} 様</Text>

          <Text>
            この度は Propositio AI へお問い合わせいただき、
            誠にありがとうございます。
          </Text>

          <Text>
            以下の内容でお問い合わせを受け付けました。
            内容を確認後、担当者よりご連絡いたします。
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
              <strong>メールアドレス</strong>
              <br />
              {email}
            </Text>

            <Text>
              <strong>件名</strong>
              <br />
              {title}
            </Text>

            <Text>
              <strong>お問い合わせ内容</strong>
            </Text>

            <Section
              style={{
                backgroundColor: "#fff",
                padding: "16px",
                borderRadius: "6px",
                whiteSpace: "pre-wrap",
              }}
            >
              <Text>{content}</Text>
            </Section>
          </Section>

          <Text>
            ※ 通常2〜3日以内にご返信いたします。
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

export default ContactThanksEmail
