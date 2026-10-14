import { configureApiClient } from '@repo/api-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

configureApiClient({ baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL });

const queryClient = new QueryClient();

/**

アプリ全体のルートレイアウト。TanStack QueryのProviderとスタックナビゲーションを提供する。
src/app配下の各ファイルが1画面（1ルート）に対応する。

@param なし
@return ルートレイアウトのJSX

**/
export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <StatusBar style="auto" />
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Welcome' }} />
            </Stack>
        </QueryClientProvider>
    );
}
