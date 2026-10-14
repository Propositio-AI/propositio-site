import { ApiRequestError, useSubmitContactContactsPost, type InquiryType } from '@repo/api-client';
import { useState } from 'react';

/** お問い合わせ内容の最大文字数（バックエンドの制約と一致させる） */
export const CONTACT_MESSAGE_MAX = 2000;

/** フォームの段階。入力 → 確認 → 完了 */
export type ContactStep = 'input' | 'confirm' | 'done';

/** フォームの入力値 */
export type ContactValues = {
    inquiryType: InquiryType | '';
    name: string;
    nameKana: string;
    organization: string;
    email: string;
    message: string;
};

/** 入力チェックの対象となる項目 */
export type ContactField = keyof ContactValues | 'agreed';

/** 項目ごとのエラーメッセージ */
export type ContactErrors = Partial<Record<ContactField, string>>;

const INITIAL_VALUES: ContactValues = {
    inquiryType: '',
    name: '',
    nameKana: '',
    organization: '',
    email: '',
    message: '',
};

/**

入力値を検証し、項目ごとのエラーメッセージを返す。

@param values 入力値、agreed プライバシーポリシーに同意済みか
@return エラーメッセージ（エラーが無ければ空のオブジェクト）

**/
export function validateContact(values: ContactValues, agreed: boolean): ContactErrors {
    const errors: ContactErrors = {};
    if (!values.inquiryType) errors.inquiryType = '種別を選択してください';
    if (!values.name.trim()) errors.name = 'お名前を入力してください';
    if (!values.nameKana.trim()) errors.nameKana = 'フリガナを入力してください';
    else if (!/^[ァ-ヶー\s\u3000]+$/.test(values.nameKana.trim()))
        errors.nameKana = 'カタカナで入力してください';
    if (!values.email.trim()) errors.email = 'メールアドレスを入力してください';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
        errors.email = 'メールアドレスの形式が正しくありません';
    if (!values.message.trim()) errors.message = 'お問い合わせ内容を入力してください';
    else if (values.message.length > CONTACT_MESSAGE_MAX)
        errors.message = `${CONTACT_MESSAGE_MAX}文字以内で入力してください`;
    if (!agreed) errors.agreed = 'プライバシーポリシーへの同意が必要です';
    return errors;
}

/**

送信失敗時のエラーから、利用者に表示するメッセージを決める。

@param error 送信処理で発生したエラー
@return 表示するエラーメッセージ

**/
function toSendErrorMessage(error: unknown): string {
    if (error instanceof ApiRequestError && (error.status === 429 || error.status === 400)) {
        return error.detail ?? '送信できませんでした。時間をおいて再度お試しください。';
    }
    return '送信に失敗しました。時間をおいて再度お試しください。';
}

/**

お問い合わせフォーム（入力 → 確認 → 送信完了）の状態と送信処理を扱うカスタムフック。
入力値・エラー・段階を管理し、送信はorvalが生成したmutationを経由してバックエンドへ送る。

@param なし
@return フォームの状態と、入力・段階の切り替え・送信を行う関数群

**/
export function useContactForm() {
    const [step, setStep] = useState<ContactStep>('input');
    const [values, setValues] = useState<ContactValues>(INITIAL_VALUES);
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState<ContactErrors>({});
    const [sendError, setSendError] = useState('');
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    // Turnstileのトークンは1回限り有効なため、送信失敗時はウィジェットを作り直す
    const [turnstileKey, setTurnstileKey] = useState(0);
    const mutation = useSubmitContactContactsPost();

    /**

    指定した項目のエラーを消す。

    @param field エラーを消す項目
    @return なし

    **/
    const clearError = (field: ContactField) => setErrors((e) => ({ ...e, [field]: undefined }));

    return {
        /** 現在の段階 */
        step,
        /** 入力値 */
        values,
        /** プライバシーポリシーに同意済みか */
        agreed,
        /** 項目ごとのエラーメッセージ */
        errors,
        /** 送信失敗時のメッセージ */
        sendError,
        /** 送信中か */
        isSending: mutation.isPending,
        /** 項目の値を更新し、その項目のエラーを消す */
        setValue: <K extends keyof ContactValues>(field: K, value: ContactValues[K]) => {
            setValues((v) => ({ ...v, [field]: value }));
            clearError(field);
        },
        /** 同意チェックを切り替える */
        toggleAgreed: () => {
            setAgreed((a) => !a);
            clearError('agreed');
        },
        /** Turnstileのトークンを取得済みか */
        hasTurnstileToken: turnstileToken !== null,
        /** Turnstileウィジェットを作り直すためのキー（送信失敗のたびに変わる） */
        turnstileKey,
        /** Turnstileのトークンを設定する（ウィジェットの成功・期限切れ時に呼ぶ） */
        setTurnstileToken,
        /** 入力を検証し、問題が無ければ確認画面へ進む。進めた場合はtrueを返す */
        toConfirm: (): boolean => {
            const found = validateContact(values, agreed);
            setErrors(found);
            if (Object.keys(found).length > 0) return false;
            setSendError('');
            setStep('confirm');
            return true;
        },
        /** 入力画面へ戻る */
        back: () => {
            setSendError('');
            setStep('input');
        },
        /** 入力内容を送信し、成功したら完了画面へ進む */
        send: async () => {
            if (mutation.isPending || !values.inquiryType) return;
            setSendError('');
            try {
                await mutation.mutateAsync({
                    data: {
                        inquiry_type: values.inquiryType,
                        name: values.name.trim(),
                        name_kana: values.nameKana.trim(),
                        organization: values.organization.trim() || null,
                        email: values.email.trim(),
                        message: values.message,
                        agreed_to_privacy: true,
                        turnstile_token: turnstileToken,
                    },
                });
                setStep('done');
            } catch (error) {
                setSendError(toSendErrorMessage(error));
                setTurnstileToken(null);
                setTurnstileKey((k) => k + 1);
            }
        },
    };
}
