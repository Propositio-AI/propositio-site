import { Link } from 'react-router-dom';

/**

お問い合わせの送信完了画面。

@param なし
@return 完了画面のJSX

**/
export function ContactDone() {
    return (
        <div className="flex flex-col gap-7 border-t-2 border-ink pt-[clamp(28px,4vw,48px)]">
            <div
                data-done-mark=""
                aria-hidden="true"
                className="flex size-[72px] items-center justify-center border-2 border-ink text-[32px]"
            >
                ✓
            </div>
            <h2
                data-field=""
                className="m-0 text-[clamp(36px,4.6vw,64px)] leading-[1.2] tracking-[-.02em]"
            >
                送信しました
            </h2>
            <p data-field="" className="m-0 max-w-[30em] text-base leading-[1.9]">
                お問い合わせありがとうございます。内容を確認のうえ、ご入力いただいたメールアドレスにご連絡します。
            </p>
            <div data-field="">
                <Link className="btn btn-secondary min-w-[220px]" to="/">
                    トップへ戻る →
                </Link>
            </div>
        </div>
    );
}
