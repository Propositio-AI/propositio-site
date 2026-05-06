import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MonitorUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Karynos | Propositio AI",
    description: "Karynos の機能概要と利用ワークフローを紹介します。",
};

const features = [
    {
        title: "Dream Matching",
        label: "Career Discovery",
        description:
            "興味や価値観を起点に、まだ知らない職業や将来像と出会うための探索体験を提供します。",
        color: "blue",
        items: [
            "スワイプ型の職業探索",
            "興味に基づく保存リスト",
            "進路の候補整理",
        ],
    },
    {
        title: "Dream Action",
        label: "Career Action",
        description:
            "見つけた目標に向けて、必要な学習や行動を分解し、継続しやすい形に整えます。",
        color: "green",
        items: ["行動計画の作成", "学習リソースの整理", "進捗の見える化"],
    },
] as const;

const KarynosPage = () => {
    return (
        <main className="mt-24 bg-white px-5 py-12 sm:px-8 md:px-15 md:py-16">
            <div className="mx-auto max-w-7xl space-y-12">
                <Button
                    asChild
                    variant="outline"
                    className="h-10 border-gray-300 bg-white"
                >
                    <Link href="/#products">
                        <ArrowLeft className="size-4" />
                        トップへ戻る
                    </Link>
                </Button>

                <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div className="space-y-4">
                        <p className="text-sm font-bold uppercase tracking-normal text-gray-500">
                            Product Karynos
                        </p>
                        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-black md:text-6xl">
                            夢の発見から実行までをつなぐ、キャリア支援アプリ。
                        </h1>
                        <p className="max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                            Karynos は、<br></br>将来の選択肢を広げる Dream
                            Matching と、<br></br>行動に落とし込む Dream Action{" "}
                            の2つで構成されています。
                        </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-black text-white">
                                <MonitorUp className="size-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-black">
                                アプリ画面掲載エリア
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                実際のスクリーンショット、動画、プロトタイプ埋め込みをここに配置する想定です。
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                        >
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${feature.color === "blue" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}
                            >
                                {feature.label}
                            </span>
                            <h2 className="mt-4 text-2xl font-bold text-black">
                                {feature.title}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600">
                                {feature.description}
                            </p>
                            <div className="mt-6 space-y-3">
                                {feature.items.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                                    >
                                        <CheckCircle2
                                            className={`size-4 ${feature.color === "blue" ? "text-blue-600" : "text-green-600"}`}
                                        />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
};

export default KarynosPage;
