/**

フォーム項目の「必須」「任意」バッジ。

@param props required（trueなら必須、falseなら任意）
@return バッジのJSX

**/
export function RequiredBadge({ required }: { required: boolean }) {
    return required ? (
        <span className="bg-ink px-1.5 py-0.5 text-[11px] font-semibold tracking-[.08em] text-paper">
            必須
        </span>
    ) : (
        <span className="border border-neutral-400 px-1.5 py-0.5 text-[11px] font-semibold tracking-[.08em] text-neutral-600">
            任意
        </span>
    );
}
