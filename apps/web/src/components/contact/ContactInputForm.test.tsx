import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import type { ContactValues } from '@/hooks/useContactForm';

import { ContactInputForm } from './ContactInputForm';

const EMPTY: ContactValues = {
    inquiryType: '',
    name: '',
    nameKana: '',
    organization: '',
    email: '',
    message: '',
};

/**

テスト用にルーター付きでContactInputFormを描画する。

@param overrides 上書きするprops
@return 渡したモック関数

**/
function renderForm(overrides: Partial<Parameters<typeof ContactInputForm>[0]> = {}) {
    const props = {
        values: EMPTY,
        errors: {},
        agreed: false,
        onChange: vi.fn(),
        onToggleAgreed: vi.fn(),
        onSubmit: vi.fn(() => true),
        ...overrides,
    };
    render(
        <MemoryRouter>
            <ContactInputForm {...props} />
        </MemoryRouter>,
    );
    return props;
}

describe('ContactInputForm', () => {
    it('種別の選択・入力・同意の操作を親に通知する', async () => {
        const user = userEvent.setup();
        const props = renderForm();

        await user.click(screen.getByRole('radio', { name: '取材' }));
        await user.type(screen.getByPlaceholderText('山田 花子'), 'A');
        await user.click(screen.getByRole('checkbox'));

        expect(props.onChange).toHaveBeenCalledWith('inquiryType', 'media');
        expect(props.onChange).toHaveBeenCalledWith('name', 'A');
        expect(props.onToggleAgreed).toHaveBeenCalled();
    });

    it('確認ボタンで onSubmit を呼び、エラーメッセージを表示する', async () => {
        const user = userEvent.setup();
        const props = renderForm({ errors: { email: 'メールアドレスを入力してください' } });

        await user.click(screen.getByRole('button', { name: /入力内容を確認する/ }));

        expect(props.onSubmit).toHaveBeenCalled();
        expect(screen.getByRole('alert')).toHaveTextContent('メールアドレスを入力してください');
    });
});
