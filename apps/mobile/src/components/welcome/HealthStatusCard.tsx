import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { HealthState } from '@/hooks/useHealth';

type HealthStatusCardProps = {
    state: HealthState;
    message: string | null;
    isRefreshing: boolean;
    onRefresh: () => void;
};

const STATE_LABELS: Record<HealthState, string> = {
    loading: '確認中…',
    ok: '接続OK',
    error: '接続できません',
};

/**

バックエンドAPIとの接続状態を表示する純粋なUIコンポーネント。
再確認ボタンの操作は親から渡されたコールバックに委譲する。

@param props state（接続状態）、message（補足メッセージ）、isRefreshing（再確認中かどうか）、onRefresh（再確認ボタン押下時のコールバック）
@return 接続状態カードのJSX

**/
export function HealthStatusCard({
    state,
    message,
    isRefreshing,
    onRefresh,
}: HealthStatusCardProps) {
    const isBusy = state === 'loading' || isRefreshing;

    return (
        <View style={styles.card}>
            <Text style={styles.label}>API接続状態</Text>
            <View style={styles.row}>
                <View style={[styles.dot, dotStyles[state]]} />
                <Text style={styles.status} testID="health-status">
                    {STATE_LABELS[state]}
                </Text>
                {isBusy && <ActivityIndicator size="small" />}
            </View>
            {message !== null && <Text style={styles.message}>{message}</Text>}
            <Pressable
                accessibilityRole="button"
                disabled={isBusy}
                onPress={onRefresh}
                style={({ pressed }) => [styles.button, (pressed || isBusy) && styles.buttonDimmed]}
            >
                <Text style={styles.buttonText}>再確認</Text>
            </Pressable>
        </View>
    );
}

const dotStyles = StyleSheet.create({
    loading: { backgroundColor: '#a3a3a3' },
    ok: { backgroundColor: '#16a34a' },
    error: { backgroundColor: '#dc2626' },
});

const styles = StyleSheet.create({
    card: {
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#d4d4d4',
        backgroundColor: '#ffffff',
    },
    label: { fontSize: 14, color: '#737373' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    status: { fontSize: 16, fontWeight: '600', color: '#171717' },
    message: { fontSize: 13, color: '#737373' },
    button: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#171717',
    },
    buttonDimmed: { opacity: 0.6 },
    buttonText: { color: '#ffffff', fontWeight: '600' },
});
