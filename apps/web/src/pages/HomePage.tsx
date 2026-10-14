import { AboutSection } from '@/components/home/AboutSection';
import { HeroSection } from '@/components/home/HeroSection';
import { HomeFooter } from '@/components/home/HomeFooter';
import { HomeLoader } from '@/components/home/HomeLoader';
import { HomeScene } from '@/components/home/HomeScene';
import { IntroSection } from '@/components/home/IntroSection';
import { LatestActivitiesSection } from '@/components/home/LatestActivitiesSection';
import { MissionSection } from '@/components/home/MissionSection';
import { PrinciplesSection } from '@/components/home/PrinciplesSection';
import { ScenesSection } from '@/components/home/ScenesSection';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { useLatestActivities } from '@/hooks/useLatestActivities';

/**

トップページ（/）。最新の活動記録を取得し、各セクションを組み合わせる。

@param なし
@return トップページのJSX

**/
export function HomePage() {
    const { activities, isLoading, isError } = useLatestActivities();
    return (
        <HomeScene>
            <HomeLoader />
            <SiteHeader variant="home" />
            <main>
                <HeroSection />
                <AboutSection />
                <IntroSection />
                <ScenesSection />
                <MissionSection />
                <PrinciplesSection />
                <LatestActivitiesSection
                    activities={activities}
                    isLoading={isLoading}
                    isError={isError}
                />
            </main>
            <HomeFooter lastUpdatedAt={activities[0]?.published_at} />
        </HomeScene>
    );
}
