import SectionHeading from "@/components/parts/SectionHeading";
import Reveal from "@/components/parts/Reveal";

const WhyDreamSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-26">
      <Reveal>
      <SectionHeading
        eyebrow={'Why "Dream"'}
        title="夢は、人生という航海の「北極星」。"
        lead="「夢を持つことに、どんな価値があるのか？」——私たちの答えは明確です。夢とは、自分の可能性を具体的な「力」に変えるための北極星であり、人生の航海におけるGPSです。目的地が定まった瞬間、これまで“やらされる苦行”だった学習は、目的地へ到達するための「先行投資」へとその意味を変えます。"
      />
      </Reveal>
    </section>
  );
};

export default WhyDreamSection;
