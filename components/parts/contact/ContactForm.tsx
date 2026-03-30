"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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
    .max(32, "件名は32文字以内で入力してください。"),
  content: z
    .string()
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

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>お問い合わせフォーム</CardTitle>
        <CardDescription>
          ご質問やご相談は、以下のフォームからお寄せください。
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
                    autoComplete="off"
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
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

export default ContactForm
