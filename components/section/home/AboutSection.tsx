
import { TextReveal } from "@/components/unlumen-ui/text-reveal";
import Image from "next/image";

const AboutSection = () => {
  return (
    <div
      id="about"
      className="py-8 px-6 md:mt-10 md:px-15">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">
        <TextReveal as="span" text="About" startDelay={0.1} />
      </h2>
      <div className="container mx-auto md:flex md:justify-around mb-18">
        <div className="space-y-2 mb-10 md:mb-0 md:w-1/3">
          <h3 className="text-3xl md:text-6xl font-semibold mb-5">
            <TextReveal as="span" className="block leading-tight" text="夢を夢で" startDelay={0.3} />
            <TextReveal as="span" className="block leading-tight" text="終わらせない" startDelay={0.7} />
          </h3>
          <p className="text-sm md:text-lg text-muted-foreground">
            <TextReveal as="span" text="AIの力で、すべての学生が自分の可能性を信じ、それを実現するための手段を得られる社会へ" startDelay={1} />
          </p>
        </div>
        <Image src="/images/history.png" alt="History" width={600} height={400} className="w-full h-auto object-contain md:w-3/7 md:pl-8" />
      </div>
      <div>
        <dl className="flex flex-col md:flex-row md:items-center md:justify-around">
          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">
              <TextReveal as="span" text="団体名" startDelay={0.2} />
            </dt>
            <dd className="text-3xl mb-6 md:mb-0">
              <TextReveal as="span" text="Propositio AI" startDelay={0.5} />
            </dd>
          </div>
          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">
              <TextReveal as="span" text="設立年月" startDelay={0.35} />
            </dt>
            <dd className="text-3xl mb-6 md:mb-0">
              <TextReveal as="span" text="2024年11月" startDelay={0.65} />
            </dd>
          </div>
          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">
              <TextReveal as="span" text="事業内容" startDelay={0.5} />
            </dt>
            <dd className="text-3xl mb-6 md:mb-0">
              <TextReveal as="span" text="EdTech事業" startDelay={0.8} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default AboutSection
