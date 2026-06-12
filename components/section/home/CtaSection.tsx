import PillLink from "@/components/parts/PillLink";
import Reveal from "@/components/parts/Reveal";

const CtaSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-6 md:px-10 md:pb-32 md:pt-10">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-slate-900 text-balance md:text-[38px]">
            生徒の“今”が、未来とつながる教室へ。
          </h2>
          <p className="mt-5 text-base leading-loose text-slate-600">
            導入のご相談・資料請求はお気軽にどうぞ。先生方の声を一番に、プロダクトは日々進化しています。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <PillLink href="/contact">資料を請求する →</PillLink>
            <PillLink href="/join" variant="outline">仲間を募集中</PillLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CtaSection;
