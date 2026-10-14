import { describe, expect, it } from 'vitest';

import { CONTACT_MESSAGE_MAX, validateContact, type ContactValues } from './useContactForm';

const VALID: ContactValues = {
    inquiryType: 'partnership',
    name: '山田 花子',
    nameKana: 'ヤマダ　ハナコ',
    organization: '',
    email: 'hanako@example.com',
    message: '連携についてご相談させてください。',
};

describe('validateContact', () => {
    it('正しい入力ではエラーを返さない', () => {
        expect(validateContact(VALID, true)).toEqual({});
    });

    it('必須項目が空・同意なしの場合は項目ごとにエラーを返す', () => {
        const errors = validateContact(
            { ...VALID, inquiryType: '', name: ' ', nameKana: '', email: '', message: '' },
            false,
        );
        expect(Object.keys(errors).sort()).toEqual(
            ['agreed', 'email', 'inquiryType', 'message', 'name', 'nameKana'].sort(),
        );
    });

    it('フリガナがカタカナ以外、メール形式不正、文字数超過を検出する', () => {
        const errors = validateContact(
            {
                ...VALID,
                nameKana: 'やまだ',
                email: 'not-an-email',
                message: 'あ'.repeat(CONTACT_MESSAGE_MAX + 1),
            },
            true,
        );
        expect(errors.nameKana).toBe('カタカナで入力してください');
        expect(errors.email).toBe('メールアドレスの形式が正しくありません');
        expect(errors.message).toBe(`${CONTACT_MESSAGE_MAX}文字以内で入力してください`);
    });
});
