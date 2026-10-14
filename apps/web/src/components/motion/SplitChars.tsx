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
                        {Array.from(line).map((c, j) => (
                            <span
                                key={j}
                                data-char=""
                                className="inline-block"
                                style={c === ' ' ? { whiteSpace: 'pre' } : undefined}
                            >
                                {c}
                            </span>
                        ))}
                    </Fragment>
                ))}
            </span>
        </>
    );
}
