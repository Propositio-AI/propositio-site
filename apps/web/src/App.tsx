import { Route, Routes } from 'react-router-dom';

import './styles/site-theme.css';

import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { ActivityDetailPage } from '@/pages/ActivityDetailPage';
import { ContactPage } from '@/pages/ContactPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PrivacyPage } from '@/pages/PrivacyPage';

/**

アプリ全体のルート定義。1つのURLパスに対して pages/ 配下の1コンポーネントを割り当てる。
ページごとにヘッダーの形やページ遷移の演出が異なるため、レイアウトは各ページが持つ。

@param なし
@return ルーティングのJSX

**/
function App() {
    return (
        <div className="site-theme">
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/activities/:id" element={<ActivityDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
}

export default App;
