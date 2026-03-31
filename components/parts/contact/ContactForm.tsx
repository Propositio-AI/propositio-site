"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { insertContact } from "@/app/actions/contact"
import { IoIosSend } from "react-icons/io";


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください。")
    .refine((value) => z.email().safeParse(value).success, {
      message: "メールアドレスの形式が正しくありません。",
    })
    .max(254, "メールアドレスが長すぎます。"),
  title: z
    .string()
    .min(1, "件名を入力してください。")
    .max(32, "件名は32文字以内で入力してください。"),
  content: z
    .string()
    .min(1, "お問い合わせ内容を入力してください。")
    .max(200, "お問い合わせ内容は200文字以内で入力してください。"),
})

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      title: "",
      content: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await insertContact(data);
      toast("お問い合わせを受け付けました", {
          description: "内容を確認のうえ、順次ご返信いたします。",
        }),
      form.reset();
    }
    catch (error) {
      toast.error("Failed to submit the form.");
    }

  }

  return (
    <Card className="w-full sm:max-w-md md:max-w-xl">
      <CardHeader>
        <CardTitle>お問い合わせフォーム</CardTitle>
        <CardDescription>
          ご質問やご相談は、こちらのフォームからお寄せください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="contact_form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact_form-email">
                    メールアドレス
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contact_form-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="youremail@example.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact_form-title">
                    件名
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contact_form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="例：サービスについて"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact_form-description">
                    お問い合わせ内容
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="contact_form-description"
                      placeholder="ご質問・ご相談内容を詳しくご記入ください"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/200 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex flex-col items-center">
          <Button type="submit" form="contact_form" className="px-4">
            送信する
            <IoIosSend />
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

export default ContactForm
