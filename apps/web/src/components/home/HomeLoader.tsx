import { SplitChars } from '@/components/motion/SplitChars';

/**

トップページ表示時のローディング演出（ワードマーク・カウンター・プログレスバー・2段ワイプ）。
アニメーションは useHomeMotion が [data-loader] 配下を対象に再生する。

@param なし
@return ローダーのJSX

**/
export function HomeLoader() {
    return (
        <div
            data-loader=""
            aria-hidden="true"
            className="fixed inset-0 z-[100] overflow-hidden bg-paper"
        >
            <div
                data-loader-inner=""
                className="absolute inset-0 flex flex-col justify-end gap-[clamp(24px,4vw,48px)] p-gutter"
            >
                <div
                    data-loader-word=""
                    className="overflow-hidden text-[clamp(48px,10vw,150px)] leading-[.9] font-bold tracking-[-.05em]"
                >
                    <SplitChars text="Karynos" />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-end">
                        <span
                            data-count=""
                            className="text-[clamp(40px,6vw,88px)] leading-[.85] font-semibold tracking-[-.04em] tabular-nums"
                        >
                            000
                        </span>
                    </div>
                    <div className="h-0.5 bg-neutral-200">
                        <div
                            data-loader-bar=""
                            className="h-0.5 bg-ink"
                            style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
                        />
                    </div>
                </div>
            </div>
            <div
                data-wipe="1"
                className="absolute inset-0 bg-surface"
                style={{ transform: 'scaleY(0)', transformOrigin: 'bottom' }}
            />
            <div
                data-wipe="2"
                className="absolute inset-0 bg-ink"
                style={{ transform: 'scaleY(0)', transformOrigin: 'bottom' }}
            />
        </div>
    );
}
