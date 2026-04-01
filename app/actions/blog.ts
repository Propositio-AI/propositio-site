'use server';
import { supabase } from "@/lib/supabase";


export async function getAllBlogs() {
  const { data, error } = await supabase.from("blogs").select("*");

  if(error) {
    throw new Error(error.message);
  }

  return data;
}
