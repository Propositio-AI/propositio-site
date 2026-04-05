import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useState } from "react"
import { insertBlog } from "@/app/actions/blog"


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

type NewBlogDialogProps = {
  onCreated?: () => Promise<void> | void
}

const NewBlogDialog = ({ onCreated }: NewBlogDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail_url: "",
      instagram_url: "",
      tags: "",
      published_at: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const tagsArray = data.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);

      const processedData = {
        ...data,
        tags: tagsArray,
      };

      await insertBlog(processedData);
      await onCreated?.();

      toast("ブログを作成しました", {
        description: "ブログが正常に作成されました。",
      });

      form.reset();
      setOpen(false);
    }
    catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create blog.";
      toast.error("ブログの作成に失敗しました", {
        description: message,
      });
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-green-600 text-white" >New Blog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm border-2 border-gray-300 rounded-lg">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>ブログ登録</DialogTitle>
              <DialogDescription>
                情報を入力して新しいブログを登録してください。
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
                      className="min-h-24 resize-none"
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
              <Button type="submit">登録</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewBlogDialog
