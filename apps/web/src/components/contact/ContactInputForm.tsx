import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { RequiredBadge } from '@/components/common/RequiredBadge';
import {
    CONTACT_MESSAGE_MAX,
    type ContactErrors,
    type ContactValues,
} from '@/hooks/useContactForm';
import { gsap } from '@/lib/gsap';

import { INQUIRY_TYPE_OPTIONS } from './inquiryTypes';

type ContactInputFormProps = {
    values: ContactValues;
    errors: ContactErrors;
    agreed: boolean;
    /** 項目の値が変わったときのコールバック */
    onChange: <K extends keyof ContactValues>(field: K, value: ContactValues[K]) => void;
    /** 同意チェックを切り替えるときのコールバック */
    onToggleAgreed: () => void;
    /** 「入力内容を確認する」押下時のコールバック。確認画面へ進めた場合はtrueを返す */
    onSubmit: () => boolean;
};

const UNDERLINE_INPUT_CLASS =
    'rounded-none border-0 border-b-2 border-ink bg-transparent py-3 text-lg leading-[1.4] font-medium text-ink outline-none focus:border-accent';

/**

お問い合わせの入力フォーム（種別・お名前・フリガナ・所属・メールアドレス・内容・同意）。
入力値と検証は親（useContactForm）が持ち、このコンポーネントは表示と入力の通知のみを行う。
入力に誤りがある場合は送信ボタンを揺らして知らせる。

@param props values（入力値）、errors（エラーメッセージ）、agreed（同意済みか）、onChange（入力時）、onToggleAgreed（同意切り替え時）、onSubmit（確認ボタン押下時）
@return 入力フォームのJSX

**/
export function ContactInputForm({
    values,
    errors,
    agreed,
    onChange,
    onToggleAgreed,
    onSubmit,
}: ContactInputFormProps) {
    const ctaRef = useRef<HTMLButtonElement>(null);

    return (
        <form
            noValidate
            onSubmit={(e) => {
                e.preventDefault();
                if (!onSubmit()) {
                    gsap.fromTo(
                        ctaRef.current,
                        { x: -8 },
                        { x: 0, duration: 0.6, ease: 'elastic.out(1,0.3)' },
                    );
                }
            }}
            className="flex flex-col border-t-2 border-ink"
        >
            <fieldset
                data-field=""
                className="m-0 flex flex-col gap-3 border-0 border-b border-neutral-300 px-0 py-6"
            >
                <legend className="contents">
                    <FieldLabel label="お問い合わせ種別" required />
                </legend>
                <div className="flex flex-wrap gap-2">
                    {INQUIRY_TYPE_OPTIONS.map((o) => (
                        <label key={o.value} className="cursor-pointer">
                            <input
                                type="radio"
                                name="inquiry_type"
                                value={o.value}
                                checked={values.inquiryType === o.value}
                                onChange={() => onChange('inquiryType', o.value)}
                                className="peer sr-only"
                            />
                            <span className="block border border-ink px-4 py-3 text-sm leading-none font-semibold transition-colors peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-accent">
                                {o.label}
                            </span>
                        </label>
                    ))}
                </div>
                <FieldError message={errors.inquiryType} />
            </fieldset>

            <div
                data-field=""
                className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-6 border-b border-neutral-300"
            >
                <TextField
                    label="お名前"
                    required
                    value={values.name}
                    error={errors.name}
                    placeholder="山田 花子"
                    autoComplete="name"
                    onChange={(v) => onChange('name', v)}
                />
                <TextField
                    label="フリガナ"
                    required
                    value={values.nameKana}
                    error={errors.nameKana}
                    placeholder="ヤマダ ハナコ"
                    onChange={(v) => onChange('nameKana', v)}
                />
            </div>
            <div data-field="" className="border-b border-neutral-300">
                <TextField
                    label="所属（学校・団体名）"
                    required={false}
                    value={values.organization}
                    placeholder="〇〇大学 / 〇〇株式会社"
                    autoComplete="organization"
                    onChange={(v) => onChange('organization', v)}
                />
            </div>
            <div data-field="" className="border-b border-neutral-300">
                <TextField
                    label="メールアドレス"
                    required
                    type="email"
                    value={values.email}
                    error={errors.email}
                    placeholder="name@example.com"
                    autoComplete="email"
                    onChange={(v) => onChange('email', v)}
                />
            </div>
            <label data-field="" className="flex flex-col gap-2.5 border-b border-neutral-300 py-6">
                <FieldLabel
                    label="お問い合わせ内容"
                    required
                    trailing={
                        <span className="ml-auto text-xs font-semibold text-neutral-600 tabular-nums">
                            {values.message.length} / {CONTACT_MESSAGE_MAX}
                        </span>
                    }
                />
                <textarea
                    value={values.message}
                    onChange={(e) => onChange('message', e.target.value)}
                    rows={7}
                    placeholder="ご用件をご記入ください"
                    aria-invalid={!!errors.message}
                    className="resize-y rounded-none border-2 border-ink bg-transparent p-3.5 text-base leading-[1.9] font-medium text-ink outline-none focus:border-accent"
                />
                <FieldError message={errors.message} />
            </label>
            <div data-field="" className="flex flex-col gap-2.5 py-6">
                <label className="flex cursor-pointer items-center gap-3.5 text-[15px] leading-[1.6] font-semibold">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={onToggleAgreed}
                        className="peer sr-only"
                    />
                    <span
                        aria-hidden="true"
                        className="flex size-[22px] flex-none items-center justify-center border-2 border-ink text-sm leading-none text-paper peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
                    >
                        {agreed ? '✓' : ''}
                    </span>
                    <span>
                        <Link to="/privacy" target="_blank" className="text-ink underline">
                            プライバシーポリシー
                        </Link>
                        に同意する
                    </span>
                </label>
                <FieldError message={errors.agreed} />
            </div>
            <button
                ref={ctaRef}
                type="submit"
                className="btn btn-primary min-w-[280px] self-start justify-between px-6 py-[18px] text-base"
            >
                入力内容を確認する<span aria-hidden="true">→</span>
            </button>
        </form>
    );
}

type FieldLabelProps = {
    label: string;
    required: boolean;
    /** ラベル行の右端に置く要素（文字数カウンターなど） */
    trailing?: ReactNode;
};

/**

フォーム項目のラベル（項目名 + 必須/任意バッジ）。

@param props label（項目名）、required（必須か）、trailing（右端に置く要素）
@return ラベル行のJSX

**/
function FieldLabel({ label, required, trailing }: FieldLabelProps) {
    return (
        <span className="flex items-center gap-2.5 text-sm font-bold">
            {label}
            <RequiredBadge required={required} />
            {trailing}
        </span>
    );
}

/**

フォーム項目のエラーメッセージ。エラーが無いときも高さを確保してレイアウトのずれを防ぐ。

@param props message（エラーメッセージ）
@return エラーメッセージのJSX

**/
function FieldError({ message }: { message?: string }) {
    return (
        <span role={message ? 'alert' : undefined} className="min-h-[1em] text-[13px] text-danger">
            {message}
        </span>
    );
}

type TextFieldProps = {
    label: string;
    required: boolean;
    value: string;
    error?: string;
    placeholder: string;
    type?: 'text' | 'email';
    autoComplete?: string;
    onChange: (value: string) => void;
};

/**

下線スタイルの1行入力欄（ラベル・入力欄・エラー表示）。

@param props label（項目名）、required（必須か）、value（値）、error（エラー）、placeholder、type、autoComplete、onChange（入力時）
@return 入力欄のJSX

**/
function TextField({
    label,
    required,
    value,
    error,
    placeholder,
    type = 'text',
    autoComplete,
    onChange,
}: TextFieldProps) {
    return (
        <label className="flex flex-col gap-2.5 py-6">
            <FieldLabel label={label} required={required} />
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={!!error}
                className={UNDERLINE_INPUT_CLASS}
            />
            {required && <FieldError message={error} />}
        </label>
    );
}
