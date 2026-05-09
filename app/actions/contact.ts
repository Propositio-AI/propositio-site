'use server';
import { supabase_anon, supabase_role } from "@/lib/supabase";

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