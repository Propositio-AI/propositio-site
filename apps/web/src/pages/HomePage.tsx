import { AboutSection } from '@/components/home/AboutSection';
import { CurrentWorkSection } from '@/components/home/CurrentWorkSection';
import { DialogueSection } from '@/components/home/DialogueSection';
import { FutureSection } from '@/components/home/FutureSection';
import { HeroSection } from '@/components/home/HeroSection';
import { HomeFooter } from '@/components/home/HomeFooter';
import { HomeLoader } from '@/components/home/HomeLoader';
import { HomeScene } from '@/components/home/HomeScene';
import { IssueSection } from '@/components/home/IssueSection';
import { JoinSection } from '@/components/home/JoinSection';
import { LatestActivitiesSection } from '@/components/home/LatestActivitiesSection';
import { QuestionsSection } from '@/components/home/QuestionsSection';
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
                <QuestionsSection />
                <IssueSection />
                <DialogueSection />
                <CurrentWorkSection />
                <FutureSection />
                <AboutSection />
                <LatestActivitiesSection
                    activities={activities}
                    isLoading={isLoading}
                    isError={isError}
                />
                <JoinSection />
            </main>
            <HomeFooter lastUpdatedAt={activities[0]?.published_at} />
        </HomeScene>
    );
}
