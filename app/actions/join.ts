'use server';
import { supabase_anon, supabase_role } from "@/lib/supabase";

type ApplicationFormData = {
  email: string;
  name: string;
  school_info: string;
  position: string;
  motivation: string;
};

export async function insertApplication(data: ApplicationFormData) {
  const { error } = await supabase_anon.from("join_applications").insert([data]);

  if(error) {
    throw new Error(error.message);
  }

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