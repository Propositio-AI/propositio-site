import { useHealthHealthGet } from '@repo/api-client';
import { renderHook } from '@testing-library/react-native';

import { useHealth } from '@/hooks/useHealth';

jest.mock('@repo/api-client', () => ({
    useHealthHealthGet: jest.fn(),
}));

const mockedUseHealthHealthGet = jest.mocked(useHealthHealthGet);

/**

生成されたヘルスチェックHookの戻り値をテスト用に差し替える。

@param result useHealthHealthGetが返すクエリ結果のうち、テストで使う項目
@return なし

**/
function mockHealthQuery(result: Record<string, unknown>): void {
    mockedUseHealthHealthGet.mockReturnValue({
        data: undefined,
        error: null,
        isError: false,
        isRefetching: false,
        refetch: jest.fn(),
        ...result,
    } as unknown as ReturnType<typeof useHealthHealthGet>);
}

describe('useHealth', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('レスポンス待ちの間はloadingを返す', async () => {
        mockHealthQuery({});

        const { result } = await renderHook(() => useHealth());

        expect(result.current.state).toBe('loading');
        expect(result.current.message).toBeNull();
    });

    it('APIがstatus=okを返した場合はokを返す', async () => {
        mockHealthQuery({ data: { data: { status: 'ok' }, status: 200 } });

        const { result } = await renderHook(() => useHealth());

        expect(result.current.state).toBe('ok');
        expect(result.current.message).toBe('ok');
    });

    it('API呼び出しが失敗した場合はerrorとエラーメッセージを返す', async () => {
        mockHealthQuery({ isError: true, error: new Error('Network request failed') });

        const { result } = await renderHook(() => useHealth());

        expect(result.current.state).toBe('error');
        expect(result.current.message).toBe('Network request failed');
    });

    it('refreshを呼ぶとクエリを再実行する', async () => {
        const refetch = jest.fn().mockResolvedValue(undefined);
        mockHealthQuery({ refetch });

        const { result } = await renderHook(() => useHealth());
        result.current.refresh();

        expect(refetch).toHaveBeenCalledTimes(1);
    });
});
