import SectionHeading from "@/components/parts/SectionHeading";
import GradientPanel from "@/components/parts/GradientPanel";
import PillLink from "@/components/parts/PillLink";
import Reveal from "@/components/parts/Reveal";

const AnswerSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:pb-32 md:pt-26">
      <Reveal>
      <GradientPanel>
        <SectionHeading
          inverted
          eyebrow="Our Answer"
          title="キャリアと学習を接続するAIプラットフォームで、生徒に「夢」という北極星を取り戻す。"
        />
        <PillLink href="/contact" variant="white" className="mt-8">
          導入について相談する →
        </PillLink>
      </GradientPanel>
      </Reveal>
    </section>
  );
};

export default AnswerSection;
