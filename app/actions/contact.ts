'use server';
import { supabase_anon, supabase_role } from "@/lib/supabase";
import { render } from "@react-email/render";
import ContactThanksEmail from "@/components/email/ContactThanksEmail";
import { sesClient } from "@/lib/ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";

type ContactFormData = {
  email: string;
  title: string;
  content: string;
};

export async function insertContact(data: ContactFormData) {
  const { error } = await supabase_anon.from("contact_inquiries").insert([data]);

  if (error) {
    throw new Error(error.message);
  }

  // slack通知
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text:`
      新しいお問い合わせが来ました！
      
【件名】
${data.title}

【メールアドレス】
${data.email}

【内容】
${data.content}
      `,
    }),
  });

  // 自動返信メール
  const emailHtml = await render(
    ContactThanksEmail({
      email: data.email,
      title: data.title,
      content: data.content,
    })
  );

  await sesClient.send(
    new SendEmailCommand({
      Source: "Propositio AI <no-reply@propositio.com>",
      Destination: {
        ToAddresses: [data.email],
      },
      Message: {
        Subject: {
          Data: "お問い合わせありがとうございます",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailHtml,
            Charset: "UTF-8",
          },
        }
      }
    })
  )


  return { success: true };
}

export async function getAllContacts() {
  const { data, error } = await supabase_role.from("contact_inquiries").select("*").order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateContactStatus(id: string, status: string) {
  const { error } = await supabase_role
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}