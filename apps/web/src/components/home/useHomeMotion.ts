import Lenis from 'lenis';

import {
    gsap,
    isCoarsePointer,
    prefersReducedMotion,
    scrambleText,
    ScrollTrigger,
    useGSAP,
} from '@/lib/gsap';

import type { RefObject } from 'react';

/** 「それらしいもの」を生成中のように見せるときに使う文字 */
const GENERATE_POOL =
    'あいうえおかきくけこさしすせそたちつてとなにのはひふへまみむめもやゆよらりるれろわ言葉思意志信念';

/**

トップページ全体のモーション（ローダー → ヒーロー登場、慣性スクロール、ヘッダーの出し入れ、
各セクションのスクロール連動演出）を、data属性を目印にまとめて設定するUI用フック。
「視差効果を減らす」設定の場合は、ローダーと慣性スクロール・自動で繰り返す演出を省略する。

@param rootRef トップページのルート要素
@return なし

**/
export function useHomeMotion(rootRef: RefObject<HTMLElement | null>) {
    useGSAP(
        (_context, contextSafe) => {
            const root = rootRef.current;
            if (!root) return;
            const q = <T extends Element = HTMLElement>(s: string) =>
                gsap.utils.toArray<T>(s, root);
            const one = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s);
            const reduced = prefersReducedMotion();
            const cleanups: (() => void)[] = [];

            // --- 慣性スクロール（Lenis）とページ内アンカー ---
            let lenis: Lenis | null = null;
            if (!reduced) {
                lenis = new Lenis({ lerp: 0.09 });
                lenis.on('scroll', ScrollTrigger.update);
                const tick = (t: number) => lenis?.raf(t * 1000);
                gsap.ticker.add(tick);
                gsap.ticker.lagSmoothing(0);
                lenis.stop();
                cleanups.push(() => {
                    gsap.ticker.remove(tick);
                    gsap.ticker.lagSmoothing(500, 33);
                    lenis?.destroy();
                });
            }
            q<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
                /**

                ページ内アンカーへ、ヘッダーの高さ分ずらしてスムーズにスクロールする。

                @param e クリックイベント
                @return なし

                **/
                const onClick = (e: MouseEvent) => {
                    const id = a.getAttribute('href') ?? '';
                    const target = id.length > 1 ? root.querySelector<HTMLElement>(id) : null;
                    if (!target) return;
                    e.preventDefault();
                    if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.6 });
                    else
                        window.scrollTo({
                            top: target.getBoundingClientRect().top + window.scrollY - 60,
                            behavior: reduced ? 'auto' : 'smooth',
                        });
                };
                a.addEventListener('click', onClick);
                cleanups.push(() => a.removeEventListener('click', onClick));
            });

            // --- ローダー → ヒーロー登場 ---
            const header = one('[data-header]');
            const loader = one('[data-loader]');
            const heroChars = q('[data-hero-title] [data-char]');
            const tagChars = q('[data-hero-tag] [data-char]');
            let intro: gsap.core.Timeline | null = null;
            if (reduced) {
                gsap.set(loader, { display: 'none' });
                ScrollTrigger.refresh();
            } else {
                gsap.set(heroChars, { yPercent: 115, rotate: 8 });
                gsap.set(tagChars, { opacity: 0, y: '0.5em' });
                gsap.set(q('[data-gl]'), { scaleY: 0, transformOrigin: 'top' });
                gsap.set(q('[data-shape]'), { scale: 0 });
                gsap.set(q('[data-hero-fade]'), { opacity: 0, y: 30 });
                gsap.set(header, { yPercent: -110 });
                const counter = one('[data-count]');
                const count = { v: 0 };
                intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
                intro
                    .from(
                        q('[data-loader-word] [data-char]'),
                        { yPercent: 110, duration: 1, stagger: 0.05 },
                        0.1,
                    )
                    .to(
                        count,
                        {
                            v: 100,
                            duration: 1.8,
                            ease: 'power3.inOut',
                            onUpdate: () => {
                                if (counter)
                                    counter.textContent = String(Math.round(count.v)).padStart(
                                        3,
                                        '0',
                                    );
                            },
                        },
                        0,
                    )
                    .to('[data-loader-bar]', { scaleX: 1, duration: 1.8, ease: 'power3.inOut' }, 0)
                    .to(
                        '[data-wipe="1"]',
                        { scaleY: 1, duration: 0.8, ease: 'expo.inOut' },
                        '>-0.15',
                    )
                    .to(
                        '[data-wipe="2"]',
                        { scaleY: 1, duration: 0.8, ease: 'expo.inOut' },
                        '<0.14',
                    )
                    .set('[data-loader-inner]', { opacity: 0 })
                    .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' })
                    .set(loader, { display: 'none' })
                    .to(
                        q('[data-gl]'),
                        { scaleY: 1, duration: 1.5, stagger: 0.07, ease: 'expo.inOut' },
                        '<-0.5',
                    )
                    .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.06 }, '<0.1')
                    .to(
                        tagChars,
                        { opacity: 1, y: 0, duration: 0.7, stagger: 0.035, ease: 'power3.out' },
                        '<0.25',
                    )
                    .to('[data-sweep]', { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, '<')
                    .to(
                        q('[data-shape]'),
                        { scale: 1, duration: 1.6, stagger: 0.12, ease: 'elastic.out(1,0.55)' },
                        '<0.1',
                    )
                    .to(
                        q('[data-hero-fade]'),
                        { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
                        '<0.2',
                    )
                    .to(header, { yPercent: 0, duration: 1 }, '<')
                    .add(() => {
                        q('[data-hero-scramble]').forEach((el) => scrambleText(el, 1.2));
                        lenis?.start();
                        ScrollTrigger.refresh();
                    }, '<');

                gsap.to(q('[data-spin]'), { rotate: 360, duration: 30, repeat: -1, ease: 'none' });
                gsap.fromTo(
                    '[data-scroll-line]',
                    { xPercent: -100 },
                    { xPercent: 100, duration: 1.6, repeat: -1, ease: 'power2.inOut' },
                );
            }

            // --- マウス追従（装飾図形の視差・マグネティックボタン） ---
            if (!reduced && !isCoarsePointer()) {
                const shapes = q('[data-depth]').map((el) => ({
                    d: Number(el.dataset.depth),
                    x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3' }),
                    y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3' }),
                }));
                /**

                マウス位置に応じて装飾図形を奥行きごとにずらす。

                @param e マウス移動イベント
                @return なし

                **/
                const onMove = (e: MouseEvent) => {
                    const nx = e.clientX / window.innerWidth - 0.5;
                    const ny = e.clientY / window.innerHeight - 0.5;
                    shapes.forEach((s) => {
                        s.x(nx * s.d * 2);
                        s.y(ny * s.d * 2);
                    });
                };
                window.addEventListener('mousemove', onMove);
                cleanups.push(() => window.removeEventListener('mousemove', onMove));

                q('[data-magnetic]').forEach((el) => {
                    const onEnterMove = (e: MouseEvent) => {
                        const r = el.getBoundingClientRect();
                        gsap.to(el, {
                            x: (e.clientX - r.left - r.width / 2) * 0.35,
                            y: (e.clientY - r.top - r.height / 2) * 0.45,
                            duration: 0.4,
                        });
                    };
                    const onLeave = () =>
                        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.4)' });
                    el.addEventListener('mousemove', onEnterMove);
                    el.addEventListener('mouseleave', onLeave);
                    cleanups.push(() => {
                        el.removeEventListener('mousemove', onEnterMove);
                        el.removeEventListener('mouseleave', onLeave);
                    });
                });
            }

            // --- ヘッダー：下スクロールで隠し、上スクロールで出す ---
            ScrollTrigger.create({
                start: 0,
                end: 'max',
                onUpdate: (self) => {
                    if (intro?.isActive()) return;
                    gsap.to(header, {
                        yPercent: self.direction === 1 && self.scroll() > 240 ? -110 : 0,
                        duration: 0.45,
                        ease: 'power3.out',
                        overwrite: true,
                    });
                },
            });

            // --- ヒーロー：スクロールで見出しが沈む ---
            const hero = one('[data-hero]');
            gsap.to('[data-hero-title]', {
                yPercent: 40,
                scale: 0.92,
                transformOrigin: 'left bottom',
                ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
            });
            q('[data-depth]').forEach((el) =>
                gsap.to(el.firstElementChild, {
                    yPercent: -Number(el.dataset.depth) * 2.2,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                }),
            );

            // --- 汎用のスクロール登場 ---
            q('[data-reveal]').forEach((el) =>
                gsap.from(el, {
                    y: 60,
                    opacity: 0,
                    duration: 1.1,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                }),
            );
            q('[data-split-reveal]').forEach((el) =>
                gsap.from(el.querySelectorAll('[data-char]'), {
                    yPercent: 90,
                    opacity: 0,
                    rotateX: -80,
                    duration: 1,
                    stagger: 0.035,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                }),
            );

            // --- 02 イントロ：固定して1文字ずつ塗る ---
            const fillChars = q('[data-fill-a] [data-char]');
            gsap.set(fillChars, { color: 'var(--color-ghost)' });
            gsap.timeline({
                scrollTrigger: {
                    trigger: '[data-opener]',
                    start: 'top top',
                    end: '+=120%',
                    pin: true,
                    scrub: 0.6,
                },
            }).to(fillChars, { color: 'var(--color-ink)', stagger: 0.03, ease: 'none' });

            // --- 01 About ---
            const firstCol = one('[data-about-col]');
            gsap.from(q('[data-about-line]'), {
                scaleX: 0,
                duration: 1.4,
                stagger: 0.15,
                ease: 'expo.inOut',
                scrollTrigger: { trigger: firstCol, start: 'top 85%' },
            });
            gsap.from(q('[data-about-col] > :not([data-about-line])'), {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.06,
                ease: 'expo.out',
                scrollTrigger: { trigger: firstCol, start: 'top 85%' },
            });

            // --- 03 場面：固定して4つの場面を切り替える ---
            const scenes = one('[data-scenes]');
            const scItems = q('[data-sc]');
            const scWords = q('[data-sc-word]');
            const scDots = q('[data-sc-dot]');
            const scNum = one('[data-sc-num]');
            const n = scItems.length;
            gsap.set(scItems.slice(1), { opacity: 0, yPercent: 30 });
            gsap.set(scWords.slice(1), { yPercent: 110 });
            gsap.from(scWords[0], {
                yPercent: 110,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: { trigger: scenes, start: 'top 60%' },
            });
            const sceneTl = gsap.timeline({
                scrollTrigger: {
                    trigger: scenes,
                    start: 'top top',
                    end: `+=${n * 60}%`,
                    pin: true,
                    scrub: 0.6,
                    onUpdate: (self) => {
                        const i = Math.min(n - 1, Math.round(self.progress * (n - 1)));
                        if (scNum) scNum.textContent = String(i + 1).padStart(2, '0');
                        scDots.forEach((d, j) => {
                            d.style.background =
                                j <= i ? 'var(--color-ink)' : 'var(--color-neutral-300)';
                        });
                    },
                },
            });
            sceneTl.to({}, { duration: 0.3 });
            for (let i = 1; i < n; i++) {
                sceneTl
                    .to(scWords[i - 1], { yPercent: -110, duration: 1 })
                    .to(scWords[i], { yPercent: 0, duration: 1 }, '<')
                    .to(scItems[i - 1], { opacity: 0, yPercent: -30, duration: 1 }, '<')
                    .to(scItems[i], { opacity: 1, yPercent: 0, duration: 1 }, '<0.15')
                    .to({}, { duration: 0.3 });
            }

            // --- 04 ミッション：「それらしいもの」が生成されるように入れ替わる ---
            const ai = one('[data-ai]');
            if (ai && !reduced) {
                ScrollTrigger.create({
                    trigger: ai,
                    start: 'top 85%',
                    once: true,
                    // 後から生成する無限ループのTimelineもアンマウント時に破棄されるよう、contextSafeで包む
                    onEnter: contextSafe?.(() => {
                        scrambleText(ai, 1.2, GENERATE_POOL);
                        gsap.timeline({ repeat: -1, repeatDelay: 2.6, delay: 2.6 }).call(() =>
                            scrambleText(ai, 1.2, GENERATE_POOL),
                        );
                    }),
                });
            }

            // --- 05 原則：縦スクロールで横に流す ---
            const hSection = one('[data-hsection]');
            const track = one('[data-htrack]');
            if (hSection && track) {
                const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
                const hTween = gsap.to(track, {
                    x: () => -dist(),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hSection,
                        start: 'top top',
                        end: () => `+=${dist()}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                });
                gsap.to('[data-hprogress]', {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hSection,
                        start: 'top top',
                        end: () => `+=${dist()}`,
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                });
                q('[data-hcard]').forEach((card) => {
                    gsap.from(card.querySelectorAll('[data-hc-in]'), {
                        y: 80,
                        opacity: 0,
                        stagger: 0.08,
                        duration: 1,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: hTween,
                            start: 'left 90%',
                        },
                    });
                    gsap.fromTo(
                        card,
                        { rotate: 2.5 },
                        {
                            rotate: -2.5,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: card,
                                containerAnimation: hTween,
                                start: 'left right',
                                end: 'right left',
                                scrub: true,
                            },
                        },
                    );
                });
            }

            void document.fonts?.ready.then(() => ScrollTrigger.refresh());
            return () => cleanups.forEach((fn) => fn());
        },
        { scope: rootRef },
    );
}
