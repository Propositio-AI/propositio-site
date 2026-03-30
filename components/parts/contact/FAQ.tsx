import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    value: "item-1",
    trigger: "返信はどれくらいで届きますか？",
    content:
      "通常は2〜3営業日以内にご返信します。内容によっては確認にお時間をいただく場合があります。",
  },
  {
    value: "item-2",
    trigger: "学校・団体単位での導入相談はできますか？",
    content:
      "はい、可能です。利用人数や目的に応じたご提案を行いますので、お問い合わせ本文にご希望の運用イメージをご記載ください。",
  },
  {
    value: "item-3",
    trigger: "プロダクトの不具合報告はどう送ればよいですか？",
    content:
      "発生した画面、操作手順、表示されたメッセージを添えてご連絡ください。再現情報があると、より早く調査できます。",
  },
]

const FAQ = () => {
  return (
    <div className="w-full mt-3">
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full max-w-lg"
      >
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="min-h-12 items-center py-3 text-muted-foreground">
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default FAQ
