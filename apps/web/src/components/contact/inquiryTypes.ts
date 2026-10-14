import type { InquiryType } from '@repo/api-client';

/** お問い合わせ種別の選択肢（表示順・表示名） */
export const INQUIRY_TYPE_OPTIONS: { value: InquiryType; label: string }[] = [
    { value: 'partnership', label: '連携・協力のご相談' },
    { value: 'participation', label: '検証への参加' },
    { value: 'media', label: '取材' },
    { value: 'other', label: 'その他' },
];

/**

お問い合わせ種別の表示名を返す。

@param value お問い合わせ種別
@return 表示名（未選択の場合は空文字）

**/
export function inquiryTypeLabel(value: InquiryType | ''): string {
    return INQUIRY_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? '';
}
