import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { WelcomeView } from '@/components/welcome/WelcomeView';

describe('WelcomeView', () => {
    it('タイトルと渡された接続状態の要素が表示される', async () => {
        await render(<WelcomeView healthStatus={<Text>health-slot</Text>} />);

        expect(screen.getByText('propositio-base')).toBeOnTheScreen();
        expect(screen.getByText('health-slot')).toBeOnTheScreen();
    });
});
