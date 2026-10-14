/**

ISO 8601形式の日時を「YYYY.MM.DD」形式（閲覧者のローカル日付）に整形する。

@param iso ISO 8601形式の日時文字列
@return 「2026.10.02」形式の日付文字列

**/
export function formatDate(iso: string): string {
    const d = new Date(iso);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}.${month}.${day}`;
}
