import Reveal from "@/components/parts/Reveal";
const MissionVisionSection = () => {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 py-20 md:grid-cols-2 md:px-10 md:py-24">
        <Reveal>
          <div className="h-full rounded-3xl border border-slate-100 bg-slate-50 p-9 md:p-12">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Mission
          </span>
          <h2 className="mt-4 font-heading text-[28px] font-extrabold leading-snug tracking-tight text-slate-900 md:text-3xl">
            可能性を全ての人に
          </h2>
          <p className="mt-4 text-[15px] leading-loose text-slate-500">
            全ての若者が、自らの可能性を最大化できる土壌をつくる。それが私たちの理念です。
          </p>
        </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="h-full rounded-3xl bg-slate-900 p-9 text-white md:p-12">
          <span className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            Vision
          </span>
          <h2 className="mt-4 font-heading text-[28px] font-extrabold leading-snug tracking-tight md:text-3xl">
            誰もが夢を持ち、
            <br />
            自由に追いかけられる世界
          </h2>
          <p className="mt-4 text-[15px] leading-loose text-slate-300">
            Empowering everyone to dream and chase them.
          </p>
        </div>
        </Reveal>
      </div>
    </section>
  );
};

export default MissionVisionSection;
