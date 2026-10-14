import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**

ページ遷移（パスの変化）のたびにスクロール位置を先頭へ戻す。
トップページのアンカー（#about等）はページ内スクロールに任せるため、ハッシュの変化では戻さない。

@param なし
@return なし（何も描画しない）

**/
export function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}
