import SectionHeading from "@/components/parts/SectionHeading";
import GradientPanel from "@/components/parts/GradientPanel";
import Reveal from "@/components/parts/Reveal";

const ValueSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-28">
      <Reveal>
        <GradientPanel>
          <SectionHeading
            inverted
            eyebrow="The Real Value"
            title={
              <>
                「キャリアの学び」と「教科の学習」を、
                <br className="hidden md:block" />
                継続的に接続する。
              </>
            }
            lead="キャリアを考える機会はあっても、日々の学習と結びつかなければ学びの意味は実感されません。Karynosは、分断されがちなこの2つを継続的につなぎ、生徒が自分の学びに意味を見出せる環境をつくります。"
          />
        </GradientPanel>
      </Reveal>
    </section>
  );
};

export default ValueSection;
