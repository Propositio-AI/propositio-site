'use server';
import { supabase_anon, supabase_role } from "@/lib/supabase";
import { Resend } from "resend";
import { render } from "@react-email/render";
import ApplicationThanksEmail from "@/components/email/ApplicationThanksEmail";

type ApplicationFormData = {
  email: string;
  name: string;
  school_info: string;
  position: string;
  motivation: string;
};

export async function insertApplication(data: ApplicationFormData) {
  const { error } = await supabase_anon.from("join_applications").insert([data]);

  if (error) {
    throw new Error(error.message);
  }

  // Slack通知
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: `
      新しい参加応募が来ました！
      
【名前】
${data.name}

【メールアドレス】
${data.email}

【大学学部】
${data.school_info}

【希望ポジション】
${data.position}

【志望理由】
${data.motivation}
      `,
    }),
  });

  // 自動返信メール
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const emailHtml = await render(
    ApplicationThanksEmail({
      email: data.email,
      name: data.name,
      school_info: data.school_info,
      position: data.position,
      motivation: data.motivation,
    })
  );

  await resend.emails.send({
    from: "Propositio AI <onboarding@resend.dev>",
    to: data.email,
    subject: "参加応募ありがとうございます",
    html: emailHtml,
  });

  return { success: true };
}

export async function getAllApplications() {
  const { data, error } = await supabase_role.from("join_applications").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateApplicationStatus(id: string, status: string) {
  const { error } = await supabase_role
    .from("join_applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}