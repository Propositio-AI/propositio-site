import { createClient } from "microcms-js-sdk";
import { BlogPost } from "./types";

// サーバー専用クライアント (lib/client.ts はブラウザ専用のため別実装)
const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY!,
});

export async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await client.getList<BlogPost>({
    endpoint: "blog",
    queries: { orders: "-publishedAt", limit: 50 },
  });
  return res.contents;
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    return await client.getListDetail<BlogPost>({ endpoint: "blog", contentId: id });
  } catch {
    return null;
  }
}
