import { ContactConfirm } from '@/components/contact/ContactConfirm';
import { ContactDone } from '@/components/contact/ContactDone';
import { ContactInputForm } from '@/components/contact/ContactInputForm';
import { ContactView } from '@/components/contact/ContactView';
import { useContactForm } from '@/hooks/useContactForm';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';

/**

お問い合わせページ（/contact）。フォームの状態をHooksから受け取り、段階に応じたUIへ渡す。

@param なし
@return お問い合わせページのJSX

**/
export function ContactPage() {
    const form = useContactForm();
    return (
        <ContactView step={form.step}>
            {form.step === 'input' && (
                <ContactInputForm
                    values={form.values}
                    errors={form.errors}
                    agreed={form.agreed}
                    onChange={form.setValue}
                    onToggleAgreed={form.toggleAgreed}
                    onSubmit={form.toConfirm}
                />
            )}
            {form.step === 'confirm' && (
                <ContactConfirm
                    values={form.values}
                    sendError={form.sendError}
                    isSending={form.isSending}
                    turnstileSiteKey={TURNSTILE_SITE_KEY}
                    turnstileKey={form.turnstileKey}
                    hasTurnstileToken={form.hasTurnstileToken}
                    onTurnstileToken={form.setTurnstileToken}
                    onBack={form.back}
                    onSend={() => void form.send()}
                />
            )}
            {form.step === 'done' && <ContactDone />}
        </ContactView>
    );
}
