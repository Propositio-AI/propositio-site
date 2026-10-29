import { Eyebrow } from '@/components/common/Eyebrow';
import { SplitChars } from '@/components/motion/SplitChars';

/** トップページ共通の番号ラベルと、文字単位で現れる見出し。 */
export function SectionHeading({ label, title }: { label: string; title: string | string[] }) {
    return (
        <div className="flex flex-col gap-6">
            <div data-reveal="">
                <Eyebrow>{label}</Eyebrow>
            </div>
            <h2
                data-split-reveal=""
                className="m-0 text-[clamp(30px,4.5vw,72px)] leading-[1.4] tracking-[-.03em] text-pretty"
            >
                <SplitChars text={title} />
            </h2>
        </div>
    );
}
