import { fireEvent, render, screen } from '@testing-library/react-native';

import { HealthStatusCard } from '@/components/welcome/HealthStatusCard';

describe('HealthStatusCard', () => {
    it('接続OKの状態とメッセージが表示される', async () => {
        await render(
            <HealthStatusCard state="ok" message="ok" isRefreshing={false} onRefresh={jest.fn()} />,
        );

        expect(screen.getByTestId('health-status')).toHaveTextContent('接続OK');
        expect(screen.getByText('ok')).toBeOnTheScreen();
    });

    it('再確認ボタンを押すとonRefreshが呼ばれる', async () => {
        const onRefresh = jest.fn();
        await render(
            <HealthStatusCard
                state="error"
                message={null}
                isRefreshing={false}
                onRefresh={onRefresh}
            />,
        );

        await fireEvent.press(screen.getByRole('button', { name: '再確認' }));

        expect(onRefresh).toHaveBeenCalledTimes(1);
    });
});
