import {
    gsap,
    isCoarsePointer,
    prefersReducedMotion,
    scrambleText,
    ScrollTrigger,
    useGSAP,
} from '@/lib/gsap';

import type { RefObject } from 'react';

/**

トップページ全体のモーション（ローダー → ヒーロー登場、ヘッダーの出し入れ、
各セクションのスクロール連動演出）を、data属性を目印にまとめて設定するUI用フック。
「視差効果を減らす」設定の場合は、すべての装飾モーションを省略し、内容をそのまま表示する。

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

            // ホイール操作はブラウザ標準。ページ内リンクだけ滑らかに移動する。
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
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - 100,
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
                return () => cleanups.forEach((fn) => fn());
            } else {
                gsap.set(heroChars, { yPercent: 115, rotate: 8 });
                gsap.set(tagChars, { opacity: 0, y: '0.5em' });
                gsap.set(q('[data-gl]'), { scaleY: 0, transformOrigin: 'top' });
                gsap.set(q('[data-shape]'), { scale: 0 });
                gsap.set(q('[data-hero-fade]'), { opacity: 0, y: 30 });
                gsap.set(header, { yPercent: -150 });
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

            // --- ヘッダー：メニュー操作中・キーボード操作中は隠さない ---
            ScrollTrigger.create({
                start: 0,
                end: 'max',
                onUpdate: (self) => {
                    if (intro?.isActive()) return;
                    const interacting =
                        header?.contains(document.activeElement) ||
                        header?.querySelector('[aria-expanded="true"]');
                    gsap.to(header, {
                        yPercent:
                            !interacting && self.direction === 1 && self.scroll() > 240 ? -150 : 0,
                        duration: 0.45,
                        ease: 'power3.out',
                        overwrite: true,
                    });
                },
            });

            // --- 既存のワードマークの視差を継承 ---
            const hero = one('[data-hero]');
            gsap.to('[data-hero-title]', {
                yPercent: 18,
                scale: 0.96,
                transformOrigin: 'left bottom',
                ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
            });
            q('[data-depth]').forEach((el) =>
                gsap.to(el.firstElementChild, {
                    yPercent: -Number(el.dataset.depth) * 1.5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hero,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                }),
            );

            // --- 文字と罫線の登場。通常の縦スクロールで読めるよう固定しない ---
            q('[data-reveal]').forEach((el) =>
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: el, start: 'top 92%', once: true },
                }),
            );
            q('[data-split-reveal]').forEach((el) =>
                gsap.from(el.querySelectorAll('[data-char]'), {
                    yPercent: 65,
                    opacity: 0,
                    rotateX: -50,
                    duration: 0.8,
                    stagger: { amount: 0.45 },
                    ease: 'expo.out',
                    scrollTrigger: { trigger: el, start: 'top 92%', once: true },
                }),
            );
            q('[data-rule]').forEach((el) =>
                gsap.from(el, {
                    scaleX: 0,
                    transformOrigin: 'left',
                    duration: 1.2,
                    ease: 'expo.inOut',
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                }),
            );
            gsap.from(q('[data-work-card]'), {
                y: 50,
                rotate: 1.5,
                opacity: 0,
                duration: 1,
                stagger: 0.12,
                ease: 'expo.out',
                scrollTrigger: { trigger: '[data-work-card]', start: 'top 90%', once: true },
            });
            q('[data-dialogue-line]').forEach((el, i) =>
                gsap.from(el, {
                    x: i % 2 ? 24 : -24,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
                }),
            );
            gsap.fromTo(
                q('[data-fill] [data-char]'),
                { color: 'var(--color-neutral-500)' },
                {
                    color: 'var(--color-ink)',
                    stagger: 0.04,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '[data-fill]',
                        start: 'top 85%',
                        end: 'bottom 55%',
                        scrub: 0.5,
                    },
                },
            );

            // ネイティブのdetailsを保ち、開く時も閉じる時も高さを補間する。
            q<HTMLDetailsElement>('[data-disclosure]').forEach((details) => {
                const summary = details.querySelector('summary');
                const body = details.querySelector<HTMLElement>('[data-disclosure-body]');
                if (!summary || !body) return;
                let expanded = details.open;
                const onClick = contextSafe?.((event: MouseEvent) => {
                    event.preventDefault();
                    const startHeight = details.getBoundingClientRect().height;
                    expanded = !expanded;
                    gsap.killTweensOf([details, body]);
                    details.open = true;
                    details.dataset.expanded = String(expanded);
                    details.style.height = 'auto';
                    const naturalHeight = details.getBoundingClientRect().height;
                    const style = getComputedStyle(details);
                    const closedHeight =
                        summary.offsetHeight +
                        parseFloat(style.paddingTop) +
                        parseFloat(style.paddingBottom) +
                        parseFloat(style.borderTopWidth) +
                        parseFloat(style.borderBottomWidth);
                    gsap.fromTo(
                        details,
                        { height: startHeight, overflow: 'hidden' },
                        {
                            height: expanded ? naturalHeight : closedHeight,
                            duration: 0.38,
                            ease: 'power3.inOut',
                            onComplete: () => {
                                details.open = expanded;
                                gsap.set(details, { clearProps: 'height,overflow' });
                                ScrollTrigger.refresh();
                            },
                        },
                    );
                    gsap.to(body, {
                        opacity: expanded ? 1 : 0,
                        y: expanded ? 0 : -8,
                        duration: 0.25,
                        ease: 'power2.out',
                    });
                });
                if (!onClick) return;
                summary.addEventListener('click', onClick);
                cleanups.push(() => {
                    summary.removeEventListener('click', onClick);
                    delete details.dataset.expanded;
                });
            });

            let mounted = true;
            void document.fonts?.ready.then(() => {
                if (mounted) ScrollTrigger.refresh();
            });
            return () => {
                mounted = false;
                cleanups.forEach((fn) => fn());
            };
        },
        { scope: rootRef },
    );
}
