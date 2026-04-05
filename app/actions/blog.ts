'use server';
import { supabase_anon, supabase_role } from "@/lib/supabase";

export async function getAllBlogs() {
  const { data, error } = await supabase_anon.from("blogs").select("*").order("published_at", { ascending: false });

  if(error) {
    throw new Error(error.message);
  }

  return data;
}

type BlogData = {
  title: string;
  description: string;
  thumbnail_url: string;
  instagram_url: string;
  tags: string[];
  published_at: string;
}
export async function insertBlog(blog: BlogData) {
  const normalizedBlog = {
    ...blog,
    tags: blog.tags,
  };

  const { error } = await supabase_role.from("blogs").insert([normalizedBlog]);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function deleteBlog(id: string) {
  const { error } = await supabase_role.from("blogs").delete().eq("id", id);

  if(error) {
    throw new Error(error.message);
  } 
  
  return { success: true };
}
