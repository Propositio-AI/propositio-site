"use client";

import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useEffect } from "react"
import { updateBlog } from "@/app/actions/blog"
import { Blog } from "@/lib/types"


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"


const formSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください。"),
  description: z
    .string()
    .min(1, "説明を入力してください。"),
  thumbnail_url: z
    .string()
    .min(1, "サムネイルURLを入力してください。"),
  instagram_url: z
    .string()
    .min(1, "投稿URLを入力してください。"),
  tags: z
    .string()
    .min(1, "タグを入力してください。"),
  published_at: z
    .string()
    .min(1, "公開日時を入力してください。"),
})

type EditBlogDialogProps = {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => Promise<void> | void
}

const EditBlogDialog = ({ blog, open, onOpenChange, onSaved }: EditBlogDialogProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || "",
      description: blog?.description || "",
      thumbnail_url: blog?.thumbnail_url || "",
      instagram_url: blog?.instagram_url || "",
      tags: blog?.tags?.join(", ") || "",
      published_at: blog?.published_at?.slice(0, 10) || "",
    },
  })

  useEffect(() => {
    form.reset({
      title: blog?.title || "",
      description: blog?.description || "",
      thumbnail_url: blog?.thumbnail_url || "",
      instagram_url: blog?.instagram_url || "",
      tags: blog?.tags?.join(", ") || "",
      published_at: blog?.published_at?.slice(0, 10) || "",
    });
  }, [blog, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!blog) return;

    try {
      const tagsArray = data.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);

      const processedData = {
        id: blog.id,
        ...data,
        tags: tagsArray,
      };

      await updateBlog(processedData);
      await onSaved?.();

      toast("ブログを更新しました", {
        description: "ブログが正常に更新されました。",
      });

      onOpenChange(false);
    }
    catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update blog.";
      toast.error("ブログの更新に失敗しました", {
        description: message,
      });
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm border-2 border-gray-300 rounded-lg">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>ブログ編集</DialogTitle>
              <DialogDescription>
                情報を編集してブログを更新してください。
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact_form-title">
                      タイトル
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact_form-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="ブログのタイトル"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact_form-description">
                      説明
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="contact_form-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="ブログの説明"
                      className="max-h-30 resize-none"
                      rows={5}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="thumbnail_url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact_form-thumbnail_url">
                      サムネイルURL
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact_form-thumbnail_url"
                      aria-invalid={fieldState.invalid}
                      placeholder="ブログのサムネイルURL"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="instagram_url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact_form-instagram_url">
                      投稿URL
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact_form-instagram_url"
                      aria-invalid={fieldState.invalid}
                      placeholder="ブログの投稿リンク"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="tags"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact_form-tags">
                      タグ
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact_form-tags"
                      aria-invalid={fieldState.invalid}
                      placeholder="タグをカンマ区切りで入力（例：Web,Design,Blog）"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="published_at"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact_form-published_at">
                      公開日時
                    </FieldLabel>
                    <Input
                      {...field}
                      type="date"
                      id="contact_form-published_at"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">キャンセル</Button>
              </DialogClose>
              <Button type="submit">更新</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditBlogDialog
