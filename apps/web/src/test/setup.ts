import '@testing-library/jest-dom/vitest';

// jsdomにはmatchMediaが無いため、GSAP（ScrollTrigger）や動きの設定判定が参照できるよう最小限のスタブを置く
if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }) as MediaQueryList;
}
