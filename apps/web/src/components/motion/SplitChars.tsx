import { Fragment } from 'react';

type SplitCharsProps = {
    /** 分割して表示するテキスト。配列の場合は要素ごとに改行する */
    text: string | string[];
};

/**

テキストを1文字ずつのspan（data-char）に分割して描画する。文字単位のアニメーション用。
スクリーンリーダーには分割前の文章をそのまま読ませ、分割したspanは読み上げ対象から外す。

@param props text（表示するテキスト。配列なら行ごとに改行）
@return 文字ごとに分割されたテキストのJSX

**/
export function SplitChars({ text }: SplitCharsProps) {
    const lines = Array.isArray(text) ? text : [text];
    return (
        <>
            <span className="sr-only">{lines.join('')}</span>
            <span aria-hidden="true">
                {lines.map((line, i) => (
                    <Fragment key={i}>
                        {i > 0 && <br />}
                        {/* 括弧と句読点を隣の文字とまとめ、狭い画面で行頭に孤立させない。 */}
                        {(
                            line.match(
                                /[「『（【]*[^「『（【、。！？）」』】\s][、。！？）」』】]*|\s|./gu,
                            ) ?? []
                        ).map((group, j) => (
                            <span key={j} className="inline-block whitespace-nowrap">
                                {Array.from(group).map((c, k) => (
                                    <span
                                        key={k}
                                        data-char=""
                                        className="inline-block"
                                        style={c === ' ' ? { whiteSpace: 'pre' } : undefined}
                                    >
                                        {c}
                                    </span>
                                ))}
                            </span>
                        ))}
                    </Fragment>
                ))}
            </span>
        </>
    );
}
