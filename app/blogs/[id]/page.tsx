import { client } from "@/lib/client";
import { NormalBlog } from "@/lib/types";
import Image from "next/image";

type Props = {

  params: Promise<{

    id: string;

  }>;

};

const BlogPage = async ({ params }: Props) => {

  const { id } = await params;

  const blog = await client.get({

    endpoint: "blog",

    contentId: id,

  });

  const normalBlog = blog as NormalBlog;

  if (!normalBlog) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto">
      <Image
				src={normalBlog.top_image.url}
				alt={normalBlog.title}
				width={1200}
				height={630}
				className="w-full rounded-lg"
			/>

      <h1 className="text-4xl font-bold mt-6">
        {normalBlog.title}
      </h1>

      <p className="mt-4 text-gray-500">
        {normalBlog.description}
      </p>

      <div className="flex gap-2 mt-2">
        {normalBlog.tags?.map((tag) => (
          <span
            key={tag.id}
            className="px-2 py-1 border rounded"
          >
            {tag.tag_name}
          </span>
        ))}
      </div>

      <article
        className="prose max-w-none mt-8"
        dangerouslySetInnerHTML={{
          __html: normalBlog.content,
        }}
      />
    </main>
  );
};

export default BlogPage;