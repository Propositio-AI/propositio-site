import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ReactNode } from 'react';

type WelcomeViewProps = {
    healthStatus: ReactNode;
};

/**

propositio-baseモバイルアプリのウェルカム画面を描画する純粋なUIコンポーネント。
API接続状態の表示部分は親から要素として受け取り、自身は状態を持たない。

@param props healthStatus（API接続状態を表示する要素）
@return ウェルカム画面のJSX

**/
export function WelcomeView({ healthStatus }: WelcomeViewProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>propositio-base</Text>
                <Text style={styles.description}>
                    React (Vite) / Expo + FastAPI +
                    PostgreSQLを組み合わせた、全プロジェクトのベースとなるリポジトリです。
                </Text>
            </View>
            {healthStatus}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        gap: 24,
        padding: 24,
        backgroundColor: '#fafafa',
    },
    header: { gap: 8 },
    title: { fontSize: 28, fontWeight: '700', color: '#171717' },
    description: { fontSize: 15, lineHeight: 22, color: '#525252' },
});
