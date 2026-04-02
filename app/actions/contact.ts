'use server';
import { supabase } from "@/lib/supabase";

type ContactFormData = {
  email: string;
  title: string;
  content: string;
};

export async function insertContact(data: ContactFormData) {
  const { error } = await supabase.from("contact_inquiries").insert([data]);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function getAllContacts() {
  const { data, error } = await supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateContactStatus(id: string, status: string) {
  const { error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}