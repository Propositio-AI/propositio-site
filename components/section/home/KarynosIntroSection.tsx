"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { BsLightningCharge } from "react-icons/bs";
import { GoNorthStar } from "react-icons/go";
import { FaRegCompass } from "react-icons/fa6";
import {
    FaRegHeart,
    FaProjectDiagram,
    FaRegCalendarCheck,
} from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import Link from "next/link";

const TABS = [
    { id: "matching", label: "Dream Matching" },
    { id: "action", label: "Dream Action" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PRODUCT_DATA = {
    matching: {
        badge: "Career Discovery Platform",
        title: "Dream Matching",
        tagline: "将来の夢を、スワイプで見つける",
        description:
            "マッチングアプリ感覚で500以上の職業から将来の夢を探せるサービス。診断に押し付けられるのではなく、自分の興味から選べます。",
        features: [
            {
                Icon: GoNorthStar,
                label: "押し付けない",
                desc: "診断結果に縛られない自由な探索体験",
                color: "text-blue-500",
            },
            {
                Icon: FaRegCompass,
                label: "500+の職業",
                desc: "豊富なデータベースから可能性を広げる",
                color: "text-blue-400",
            },
            {
                Icon: FaRegHeart,
                label: "自分で選ぶ",
                desc: "興味から始まる主体的なキャリア選択",
                color: "text-blue-300",
            },
        ],
        accentBg: "bg-blue-500",
        accentText: "text-blue-500",
        badgeCls: "bg-blue-50 border-blue-200 text-blue-600",
        gradient: "from-blue-600 to-blue-400",
        barColor: "bg-blue-400",
        glowColor: "bg-blue-400",
        screenGrad: "from-blue-50 to-white",
        iconBg: "bg-blue-100",
        initials: "DM",
        initialsClr: "text-blue-500",
    },
    action: {
        badge: "Career Realization Platform",
        title: "Dream Action",
        tagline: "見つけた夢を、現実に",
        description:
            "見つけた夢に対して具体的なアクションプランを提案。段階的なステップで、あなたの夢実現をサポートします。",
        features: [
            {
                Icon: FaProjectDiagram,
                label: "行動計画",
                desc: "夢実現に必要なステップバイステップの計画",
                color: "text-green-500",
            },
            {
                Icon: FaBook,
                label: "学習リソース",
                desc: "目標達成に必要な知識とスキルを体系的に提供",
                color: "text-green-400",
            },
            {
                Icon: FaRegCalendarCheck,
                label: "進捗管理",
                desc: "あなたの成長過程を追跡し達成を応援",
                color: "text-green-300",
            },
        ],
        accentBg: "bg-green-500",
        accentText: "text-green-500",
        badgeCls: "bg-green-50 border-green-200 text-green-600",
        gradient: "from-green-600 to-green-400",
        barColor: "bg-green-400",
        glowColor: "bg-green-400",
        screenGrad: "from-green-50 to-white",
        iconBg: "bg-green-100",
        initials: "DA",
        initialsClr: "text-green-500",
    },
};

const INTERVAL_MS = 10000;

export default function KarynosIntroSection() {
    const [activeTab, setActiveTab] = useState<TabId>("matching");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = Date.now();

        const barId = setInterval(() => {
            const p = Math.min(((Date.now() - start) / INTERVAL_MS) * 100, 100);
            setProgress(p);
        }, 16);

        const switchId = setTimeout(() => {
            setActiveTab((cur) => (cur === "matching" ? "action" : "matching"));
            setProgress(0);
        }, INTERVAL_MS);

        return () => {
            clearInterval(barId);
            clearTimeout(switchId);
        };
    }, [activeTab]);

    const data = PRODUCT_DATA[activeTab];

    return (
        <section id="products" className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                {/* ── Header ── */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-500 leading-tight">
                        Product
                        <span
                            className={cn(
                                "ml-3 text-5xl md:text-6xl transition-colors duration-500",
                                data.accentText,
                            )}
                        >
                            Karynos
                        </span>
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
                        Dream Matchingで夢を見つけ、Dream
                        Actionで夢実現へ。2つのサービスであなたのキャリアを支援します。
                    </p>
                </div>

                {/* ── Tab Switcher ── */}
                <div className="mb-3">
                    <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                                    activeTab === tab.id
                                        ? cn(
                                              PRODUCT_DATA[tab.id].accentBg,
                                              "text-white shadow-md",
                                          )
                                        : "text-gray-500 hover:text-gray-800",
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Progress bar (auto-switch indicator) ── */}
                <div className="h-0.5 bg-gray-200 rounded-full mb-10 max-w-xs">
                    <div
                        className={cn("h-full rounded-full", data.barColor)}
                        style={{ width: `${progress}%`, transition: "none" }}
                    />
                </div>

                {/* ── Content ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
                    >
                        {/* Left: Info */}
                        <div>
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 border rounded-full py-1 px-3 text-xs font-medium mb-4",
                                    data.badgeCls,
                                )}
                            >
                                <BsLightningCharge className="w-3 h-3" />
                                {data.badge}
                            </span>

                            <h3
                                className={cn(
                                    "bg-gradient-to-r bg-clip-text text-transparent text-4xl md:text-5xl font-bold mb-2",
                                    data.gradient,
                                )}
                            >
                                {data.title}
                            </h3>

                            <p className="text-lg font-bold text-gray-700 mb-3">
                                {data.tagline}
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                {data.description}
                            </p>

                            {/* Feature cards */}
                            <div className="grid grid-cols-3 gap-3 mb-7">
                                {data.features.map((f, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:-translate-y-1 transition-transform duration-200"
                                    >
                                        <f.Icon
                                            className={cn(
                                                "w-5 h-5 mb-2",
                                                f.color,
                                            )}
                                        />
                                        <p className="font-semibold text-xs text-gray-800 mb-1">
                                            {f.label}
                                        </p>
                                        <p className="text-[11px] text-gray-400 leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                href="/products"
                                className={cn(
                                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80",
                                    data.accentBg,
                                )}
                            >
                                詳しく見る
                                <span aria-hidden>→</span>
                            </Link>
                        </div>

                        {/* Right: App screenshot frame */}
                        <div className="flex justify-center">
                            <div className="relative">
                                {/* Glow */}
                                <div
                                    className={cn(
                                        "absolute -inset-6 -z-10 rounded-[4rem] blur-3xl opacity-20",
                                        data.glowColor,
                                    )}
                                />
                                {/* Phone frame */}
                                <div className="bg-gray-900 rounded-[3rem] p-[10px] shadow-2xl w-[220px] md:w-[260px]">
                                    <div className="bg-gray-800 rounded-[2.6rem] overflow-hidden">
                                        {/* Notch */}
                                        <div className="flex justify-center py-2">
                                            <div className="bg-gray-900 w-20 h-5 rounded-full" />
                                        </div>
                                        {/* Screen placeholder */}
                                        <div
                                            className={cn(
                                                "aspect-[9/16] flex flex-col items-center justify-center gap-3 px-6 bg-gradient-to-b",
                                                data.screenGrad,
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                                                    data.iconBg,
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "text-xl font-bold",
                                                        data.initialsClr,
                                                    )}
                                                >
                                                    {data.initials}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                                                アプリ画面
                                                <br />
                                                スクリーンショット
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
