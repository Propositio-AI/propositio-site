"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { IoIosSend } from "react-icons/io";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
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
  name: z
    .string()
    .max(15, "お名前は15文字以内で入力してください。"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください。")
    .refine((value) => z.email().safeParse(value).success, {
      message: "メールアドレスの形式が正しくありません。",
    })
    .max(254, "メールアドレスが長すぎます。"),
  school_info: z
    .string()
    .max(32, "32文字以内で入力してください。"),
  position: z
    .string()
    .max(32, "32文字以内で入力してください。"),
  motivation: z
    .string()
    .max(200, "200文字以内で入力してください。"),
})

const JoinForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      school_info: "",
      position: "",
      motivation: "",
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
    <Card className="w-full sm:max-w-lg md:max-w-2xl">
      <CardContent>
        <form id="contact_form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact_form-name">
                    お名前
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contact_form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="例：山田太郎"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
              name="school_info"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact_form-school_info">
                    大学・学部名
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contact_form-school_info"
                    aria-invalid={fieldState.invalid}
                    placeholder="例：〇〇大学〇〇学部"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="position"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact_form-position">
                    希望ポジション
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contact_form-position"
                    aria-invalid={fieldState.invalid}
                    placeholder="例：学生"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="motivation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contact_form-motivation">
                    志望動機
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="contact_form-motivation"
                      placeholder="Propositio AIに応募した理由や、貢献したいことをお書きください。"
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
          <Button type="submit" form="contact_form">
            応募する
            <IoIosSend />
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

export default JoinForm
