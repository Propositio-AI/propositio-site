"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    MonitorUp,
    MousePointer2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
    {
        id: "matching",
        label: "Dream Matching",
        eyebrow: "Career Discovery",
        title: "夢中になれる進路を、気軽に見つける。",
        description:
            "スワイプ感覚で興味を探りながら、職業や将来像との出会いを広げるキャリア発見サービスです。",
        color: "blue",
        points: ["直感的な探索体験", "職業と偶然の出会い", "興味から進路選択"],
        mockItems: ["Interest Cards", "Career Match", "Saved Dreams"],
    },
    {
        id: "action",
        label: "Dream Action",
        eyebrow: "Career Action",
        title: "見つけた夢を、今日の行動に変える。",
        description:
            "目標に向けた行動計画、学習リソース、進捗管理をまとめて支援するキャリア実現サービスです。",
        color: "green",
        points: ["行動計画の整理", "必要な学習の可視化", "進捗の継続サポート"],
        mockItems: ["Action Plan", "Learning Path", "Progress"],
    },
] as const;

type TabId = (typeof tabs)[number]["id"];

const colorStyles = {
    blue: {
        active: "border-blue-500 bg-blue-50 text-blue-700",
        indicator: "bg-blue-500",
        badge: "border-blue-200 bg-blue-50 text-blue-700",
        accent: "bg-blue-500",
        soft: "bg-blue-50 text-blue-700",
        ring: "ring-blue-100",
    },
    green: {
        active: "border-green-500 bg-green-50 text-green-700",
        indicator: "bg-green-500",
        badge: "border-green-200 bg-green-50 text-green-700",
        accent: "bg-green-500",
        soft: "bg-green-50 text-green-700",
        ring: "ring-green-100",
    },
} as const;

const KarynosIntroSection = () => {
    const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);

    const activeService = useMemo(
        () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
        [activeTab],
    );
    const styles = colorStyles[activeService.color];

    return (
        <section
            id="products"
            className="bg-white px-5 py-12 sm:px-8 md:px-15 md:py-16"
        >
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-sm font-bold uppercase tracking-normal text-gray-500">
                            Product Karynos
                        </p>
                        <h2 className="max-w-xl text-3xl font-bold leading-tight text-black md:text-5xl">
                            夢を見つけ、<br></br>行動に移すための<br></br>
                            キャリア支援アプリ。
                        </h2>
                    </div>

                    <div
                        className="grid gap-2 sm:grid-cols-2"
                        role="tablist"
                        aria-label="Karynos services"
                    >
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const tabStyles = colorStyles[tab.color];

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`karynos-panel-${tab.id}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "group relative min-h-20 rounded-lg border border-gray-200 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gray-200",
                                        isActive && tabStyles.active,
                                    )}
                                >
                                    <span className="block text-xs font-bold text-gray-500">
                                        {tab.eyebrow}
                                    </span>
                                    <span className="mt-1 block text-lg font-bold">
                                        {tab.label}
                                    </span>
                                    <span
                                        className={cn(
                                            "absolute bottom-0 left-4 h-1 w-10 rounded-full opacity-0 transition-all duration-300",
                                            tabStyles.indicator,
                                            isActive && "w-20 opacity-100",
                                        )}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    <div
                        key={activeService.id}
                        id={`karynos-panel-${activeService.id}`}
                        role="tabpanel"
                        className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                        <div
                            className={cn(
                                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold",
                                styles.badge,
                            )}
                        >
                            <MousePointer2 className="size-4" />
                            {activeService.label}
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-bold leading-tight text-black md:text-3xl">
                                {activeService.title}
                            </h3>
                            <p className="max-w-2xl text-base leading-relaxed text-gray-600">
                                {activeService.description}
                            </p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                            {activeService.points.map((point) => (
                                <div
                                    key={point}
                                    className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-700"
                                >
                                    <CheckCircle2
                                        className={cn(
                                            "mt-0.5 size-4 shrink-0",
                                            activeService.color === "blue"
                                                ? "text-blue-600"
                                                : "text-green-600",
                                        )}
                                    />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                        <Button
                            asChild
                            className="h-10 bg-black px-4 text-white hover:bg-gray-800"
                        >
                            <Link href="/products">
                                詳しく見る
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div
                        className={cn(
                            "rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm ring-8",
                            styles.ring,
                        )}
                    >
                        <div className="rounded-lg border border-gray-300 bg-white">
                            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <MonitorUp className="size-5 text-gray-700" />
                                    <span className="text-sm font-bold text-gray-700">
                                        App screen preview
                                    </span>
                                </div>
                                <span
                                    className={cn(
                                        "rounded-full px-2 py-1 text-xs font-bold",
                                        styles.soft,
                                    )}
                                >
                                    Placeholder
                                </span>
                            </div>

                            <div
                                key={`${activeService.id}-screen`}
                                className="grid min-h-80 gap-4 p-4 md:min-h-96 md:grid-cols-[0.75fr_1fr] animate-in fade-in zoom-in-95 duration-500"
                            >
                                <div className="space-y-3 rounded-lg bg-black p-4 text-white">
                                    <div
                                        className={cn(
                                            "h-2 w-16 rounded-full",
                                            styles.accent,
                                        )}
                                    />
                                    <div className="space-y-2">
                                        <div className="h-3 w-24 rounded-full bg-white/80" />
                                        <div className="h-3 w-32 rounded-full bg-white/40" />
                                    </div>
                                    <div className="mt-8 grid gap-2">
                                        {activeService.mockItems.map(
                                            (item, index) => (
                                                <div
                                                    key={item}
                                                    className="rounded-lg border border-white/15 bg-white/10 p-3 transition-transform duration-300 hover:translate-x-1"
                                                >
                                                    <div className="text-xs text-white/60">
                                                        0{index + 1}
                                                    </div>
                                                    <div className="mt-1 text-sm font-bold">
                                                        {item}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 p-6">
                                    <div className="max-w-xs text-center">
                                        <div
                                            className={cn(
                                                "mx-auto mb-4 flex size-14 items-center justify-center rounded-full text-white shadow-sm animate-pulse",
                                                styles.accent,
                                            )}
                                        >
                                            <MonitorUp className="size-7" />
                                        </div>
                                        <p className="text-lg font-bold text-black">
                                            実アプリ画面の差し込み枠
                                        </p>
                                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                            スクリーンショットや操作デモ動画が用意でき次第、この領域に配置できます。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KarynosIntroSection;
