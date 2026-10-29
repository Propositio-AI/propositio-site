import { Turnstile } from '@marsidev/react-turnstile';

import type { ContactValues } from '@/hooks/useContactForm';

import { inquiryTypeLabel } from './inquiryTypes';

type ContactConfirmProps = {
    values: ContactValues;
    /** 送信失敗時のメッセージ */
    sendError: string;
    isSending: boolean;
    /** Cloudflare Turnstileのサイトキー。空ならウィジェットを表示しない */
    turnstileSiteKey: string;
    /** Turnstileウィジェットを作り直すためのキー */
    turnstileKey: number;
    /** Turnstileのトークンを取得済みか */
    hasTurnstileToken: boolean;
    onTurnstileToken: (token: string | null) => void;
    onBack: () => void;
    onSend: () => void;
};

/**

お問い合わせの確認画面。入力内容の一覧と「修正する」「送信する」ボタンを表示する。
Turnstileが有効な場合は、トークンを取得するまで送信ボタンを無効にする。

@param props values（入力値）、sendError（送信失敗時のメッセージ）、isSending（送信中か）、turnstileSiteKey / turnstileKey / hasTurnstileToken / onTurnstileToken（ボット対策）、onBack（修正時）、onSend（送信時）
@return 確認画面のJSX

**/
export function ContactConfirm({
    values,
    sendError,
    isSending,
    turnstileSiteKey,
    turnstileKey,
    hasTurnstileToken,
    onTurnstileToken,
    onBack,
    onSend,
}: ContactConfirmProps) {
    const rows = [
        ['お問い合わせ種別', inquiryTypeLabel(values.inquiryType)],
        ['お名前', values.name],
        ['フリガナ', values.nameKana],
        ['所属', values.organization || '—'],
        ['メールアドレス', values.email],
        ['お問い合わせ内容', values.message],
    ];
    const waitingForTurnstile = Boolean(turnstileSiteKey) && !hasTurnstileToken;

    return (
        <div className="flex min-w-0 flex-col">
            <p
                data-field=""
                className="m-0 border-b border-neutral-300 py-5 text-[15px] leading-[1.8]"
            >
                以下の内容で送信します。よろしければ「送信する」を押してください。
            </p>
            <dl className="m-0">
                {rows.map(([label, value]) => (
                    <div
                        key={label}
                        data-field=""
                        className="grid grid-cols-1 sm:grid-cols-[minmax(100px,140px)_minmax(0,1fr)] gap-5 border-b border-neutral-300 py-5"
                    >
                        <dt className="text-[13px] font-bold text-neutral-700">{label}</dt>
                        <dd className="m-0 text-base leading-[1.8] break-words whitespace-pre-wrap">
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>
            {turnstileSiteKey && (
                <div data-field="" className="pt-6">
                    <Turnstile
                        key={turnstileKey}
                        siteKey={turnstileSiteKey}
                        options={{ language: 'ja', size: 'flexible' }}
                        onSuccess={onTurnstileToken}
                        onExpire={() => onTurnstileToken(null)}
                        onError={() => onTurnstileToken(null)}
                    />
                </div>
            )}
            <span
                role={sendError ? 'alert' : undefined}
                className="min-h-[1em] pt-4 text-[13px] text-danger"
            >
                {sendError}
            </span>
            <div data-field="" className="flex flex-wrap gap-3 pt-4">
                <button
                    type="button"
                    className="btn btn-secondary min-w-40"
                    onClick={onBack}
                    disabled={isSending}
                >
                    ← 修正する
                </button>
                <button
                    type="button"
                    className="btn btn-primary w-full sm:w-auto sm:min-w-52 justify-between px-6 py-[18px] text-base"
                    onClick={onSend}
                    disabled={isSending || waitingForTurnstile}
                >
                    {isSending ? '送信中…' : '送信する'}
                    <span aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
}
