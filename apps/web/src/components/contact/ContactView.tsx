import { useRef, type ReactNode } from 'react';

import { Eyebrow } from '@/components/common/Eyebrow';
import { PageFooter } from '@/components/layout/PageFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageWipe } from '@/components/motion/PageWipe';
import { SplitChars } from '@/components/motion/SplitChars';
import { usePageIntro } from '@/components/motion/usePageIntro';
import type { ContactStep } from '@/hooks/useContactForm';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import { ContactSteps } from './ContactSteps';

type ContactViewProps = {
    step: ContactStep;
    /** 右側のパネルに表示する、段階ごとの内容（入力フォーム・確認・完了） */
    children: ReactNode;
};

/**

お問い合わせページの枠。左に見出しと進行状況、右に段階ごとのパネルを置く。
段階が切り替わるたびに先頭へスクロールし、パネルの項目を順に表示する。

@param props step（現在の段階）、children（右側のパネルの内容）
@return お問い合わせページのJSX

**/
export function ContactView({ step, children }: ContactViewProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const isFirstStep = useRef(true);
    usePageIntro(rootRef, {
        direction: 'vertical',
        extra: '[data-panel] [data-field], [data-panel] button[type="submit"]',
    });

    useGSAP(
        () => {
            // 初回表示は usePageIntro が演出するため、段階が切り替わったときだけ動かす
            if (isFirstStep.current) {
                isFirstStep.current = false;
                return;
            }
            const reduced = prefersReducedMotion();
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
            if (reduced) return;
            gsap.fromTo(
                '[data-panel] [data-field], [data-panel] .btn-primary',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'expo.out' },
            );
            gsap.fromTo(
                '[data-done-mark]',
                { scale: 0, rotate: -90 },
                { scale: 1, rotate: 0, duration: 1.2, ease: 'elastic.out(1,0.5)' },
            );
        },
        { scope: rootRef, dependencies: [step] },
    );

    return (
        <div
            ref={rootRef}
            className="relative flex min-h-screen flex-col overflow-x-clip bg-paper text-ink"
        >
            <PageWipe direction="vertical" origin="bottom" />
            <SiteHeader variant="page" current="contact" />
            <main className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(40px,6vw,96px)] px-gutter pt-[clamp(64px,8vw,112px)] pb-[clamp(80px,10vw,140px)]">
                <div className="flex flex-col gap-[clamp(24px,3vw,40px)] md:sticky md:top-[120px]">
                    <div data-in="">
                        <Eyebrow>CONTACT</Eyebrow>
                    </div>
                    <h1
                        data-title=""
                        className="m-0 overflow-hidden pb-[.05em] text-[clamp(56px,9vw,150px)] leading-[.9] tracking-[-.05em]"
                    >
                        <SplitChars text="Contact" />
                    </h1>
                    <p data-in="" className="m-0 max-w-[28em] text-base leading-[1.9]">
                        連携のご相談、検証へのご協力、取材などはこちらからお寄せください。
                    </p>
                    <div data-in="">
                        <ContactSteps step={step} />
                    </div>
                </div>
                <div data-panel="" className="flex flex-col">
                    {children}
                </div>
            </main>
            <PageFooter
                links={[
                    { to: '/', label: 'トップ' },
                    { to: '/activities', label: '活動記録' },
                    { to: '/privacy', label: 'プライバシーポリシー' },
                ]}
            />
        </div>
    );
}
