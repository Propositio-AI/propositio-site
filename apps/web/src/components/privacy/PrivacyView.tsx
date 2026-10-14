import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { Eyebrow } from '@/components/common/Eyebrow';
import { PageFooter } from '@/components/layout/PageFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageWipe } from '@/components/motion/PageWipe';
import { usePageIntro } from '@/components/motion/usePageIntro';

/**

プライバシーポリシーページ（本文準備中の表示）。

@param なし
@return プライバシーポリシーページのJSX

**/
export function PrivacyView() {
    const rootRef = useRef<HTMLDivElement>(null);
    usePageIntro(rootRef, { direction: 'horizontal', title: 'fade' });

    return (
        <div
            ref={rootRef}
            className="relative flex min-h-screen flex-col overflow-x-clip bg-paper text-ink"
        >
            <PageWipe direction="horizontal" origin="right" />
            <SiteHeader variant="page" current="privacy" />
            <main className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] content-start gap-[clamp(32px,5vw,80px)] px-gutter py-[clamp(64px,9vw,120px)]">
                <div className="flex flex-col gap-6">
                    <div data-in="">
                        <Eyebrow>PRIVACY</Eyebrow>
                    </div>
                    <h1
                        data-title=""
                        className="m-0 text-[clamp(44px,6.4vw,104px)] leading-[1.1] tracking-[-.03em]"
                    >
                        プライバシー
                        <br />
                        ポリシー
                    </h1>
                </div>
                <div data-in="" className="flex flex-col gap-5 border-t-2 border-ink pt-7">
                    <div className="text-[clamp(40px,5vw,72px)] leading-none font-semibold tracking-[-.02em]">
                        準備中
                    </div>
                    <p className="m-0 text-base leading-[1.9]">
                        本文は現在準備中です。ご質問は下記までお問い合わせください。
                    </p>
                    <Link
                        to="/contact"
                        className="text-[clamp(20px,2vw,28px)] font-extrabold text-ink no-underline hover:text-accent"
                    >
                        お問い合わせフォーム →
                    </Link>
                </div>
            </main>
            <PageFooter
                links={[
                    { to: '/', label: 'トップ' },
                    { to: '/activities', label: '活動記録' },
                ]}
            />
        </div>
    );
}
