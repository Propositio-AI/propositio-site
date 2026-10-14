import { HealthStatusCard } from '@/components/welcome/HealthStatusCard';
import { WelcomeView } from '@/components/welcome/WelcomeView';
import { useHealth } from '@/hooks/useHealth';

/**

モバイルアプリのトップ画面（/）。useHealthの結果をUIコンポーネントにpropsとして渡すだけのページ。

@param なし
@return ウェルカム画面のJSX

**/
export default function WelcomeScreen() {
    const { state, message, isRefreshing, refresh } = useHealth();

    return (
        <WelcomeView
            healthStatus={
                <HealthStatusCard
                    state={state}
                    message={message}
                    isRefreshing={isRefreshing}
                    onRefresh={refresh}
                />
            }
        />
    );
}
