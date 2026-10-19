import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { Eyebrow } from '@/components/common/Eyebrow';
import { PageFooter } from '@/components/layout/PageFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageWipe } from '@/components/motion/PageWipe';
import { usePageIntro } from '@/components/motion/usePageIntro';

type PolicySection = {
    title: string;
    paragraphs?: string[];
    items?: string[];
};

const ENACTED_ON = '2026年10月14日';

const SECTIONS: PolicySection[] = [
    {
        title: '基本方針',
        paragraphs: [
            'Propositio AI（以下「当団体」）は、Karynos のウェブサイト（以下「本サイト」）において取得する個人情報を、個人情報の保護に関する法律その他の関係法令を遵守し、以下のとおり適切に取り扱います。',
        ],
    },
    {
        title: '取得する情報',
        paragraphs: ['当団体は、本サイトを通じて次の情報を取得します。'],
        items: [
            'お問い合わせフォームに入力された情報（お問い合わせ種別、氏名、フリガナ、所属、メールアドレス、お問い合わせ内容）',
            'フォームの不正送信を防ぐために取得する、IPアドレス・ブラウザの種類などの技術的な情報',
            '本サイトへのアクセス時にサーバーに記録される、IPアドレス・アクセス日時・閲覧ページなどのアクセスログ',
        ],
    },
    {
        title: '利用目的',
        paragraphs: ['取得した情報は、次の目的の範囲内で利用します。'],
        items: [
            'お問い合わせへの回答、およびそのために必要なご連絡',
            '連携・協力、取材、活動への参加に関するご相談への対応',
            'スパムや不正な送信の防止、本サイトの安全な運営',
            '障害の調査など、本サイトの保守・改善',
        ],
    },
    {
        title: '第三者への提供',
        paragraphs: [
            '当団体は、法令に基づく場合を除き、ご本人の同意を得ることなく個人情報を第三者に提供しません。',
        ],
    },
    {
        title: '外部サービスの利用',
        paragraphs: [
            '本サイトでは、次の外部サービスを利用しています。各サービスでの情報の取扱いは、それぞれの事業者のプライバシーポリシーに従います。これらの事業者のサーバーは日本国外にある場合があります。',
        ],
        items: [
            'Amazon Web Services（Amazon Web Services, Inc.）：お問い合わせの通知メール・自動返信メールの送信に利用します。',
            'Cloudflare Turnstile（Cloudflare, Inc.）：フォームのボット対策に利用します。判定のため、ブラウザや端末の情報が同社に送信されます。',
        ],
    },
    {
        title: 'Cookie・アクセス解析',
        paragraphs: ['本サイトは、アクセス解析や広告配信を目的とした Cookie を使用していません。'],
    },
    {
        title: '安全管理',
        paragraphs: [
            '当団体は、個人情報への不正アクセス、紛失、漏えい等を防ぐため、閲覧できる者を運営メンバーに限定するなど、必要かつ適切な安全管理措置を講じます。個人情報は利用目的の達成に必要な期間に限って保管し、不要となった時点で削除します。',
        ],
    },
    {
        title: '開示・訂正・削除等のご請求',
        paragraphs: [
            'ご本人から、保有する個人情報の開示、訂正、追加、削除、利用停止等のご請求があった場合は、ご本人であることを確認したうえで、法令に従い遅滞なく対応します。ご請求は下記のお問い合わせ窓口から受け付けます。',
        ],
    },
    {
        title: '本ポリシーの変更',
        paragraphs: [
            '当団体は、法令の改正や運営内容の変更に応じて、本ポリシーを改定することがあります。改定後の内容は、本ページに掲載した時点から効力を生じます。',
        ],
    },
    {
        title: 'お問い合わせ窓口',
        paragraphs: [
            '本ポリシーおよび個人情報の取扱いに関するお問い合わせは、お問い合わせフォームからご連絡ください。当団体の所在地・代表者についても、お問い合わせいただければ遅滞なく回答します。',
        ],
    },
];

/**

プライバシーポリシーページ。左に見出し、右に条文を番号付きで並べる。

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
                <div className="flex flex-col gap-6 self-start lg:sticky lg:top-28">
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
                    <p data-in="" className="m-0 text-sm font-semibold text-neutral-700">
                        {ENACTED_ON} 制定
                    </p>
                </div>
                <div data-in="" className="flex flex-col border-t-2 border-ink">
                    <ol className="m-0 list-none p-0">
                        {SECTIONS.map((section, index) => (
                            <li
                                key={section.title}
                                className="flex flex-col gap-4 border-b border-neutral-300 py-8"
                            >
                                <h2 className="m-0 flex items-baseline gap-4 text-[clamp(20px,2vw,26px)] tracking-[-.01em]">
                                    <span className="text-xs font-semibold tracking-[.14em] text-neutral-600">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {section.title}
                                </h2>
                                {section.paragraphs?.map((paragraph) => (
                                    <p key={paragraph} className="m-0 text-base leading-[1.9]">
                                        {paragraph}
                                    </p>
                                ))}
                                {section.items && (
                                    <ul className="m-0 flex list-disc flex-col gap-2 pl-6 text-base leading-[1.9]">
                                        {section.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ol>
                    <Link
                        to="/contact"
                        className="pt-8 text-[clamp(20px,2vw,28px)] font-extrabold text-ink no-underline hover:text-accent"
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
