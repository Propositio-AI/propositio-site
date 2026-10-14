import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { configureApiClient, customFetch, getApiBaseUrl } from './custom-fetch';

describe('configureApiClient', () => {
    afterEach(() => {
        configureApiClient({});
    });

    it('末尾のスラッシュを取り除いてベースURLを設定する', () => {
        configureApiClient({ baseUrl: 'http://api.example.com/' });

        expect(getApiBaseUrl()).toBe('http://api.example.com');
    });

    it('未指定の場合は既定値を使う', () => {
        configureApiClient({ baseUrl: '' });

        expect(getApiBaseUrl()).toBe('http://localhost:8000');
    });
});

describe('customFetch', () => {
    const fetchMock = vi.fn<typeof fetch>();

    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock);
        configureApiClient({ baseUrl: 'http://api.example.com' });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        fetchMock.mockReset();
        configureApiClient({});
    });

    it('ベースURLを付与してリクエストし、{ data, status, headers }形式で返す', async () => {
        fetchMock.mockResolvedValue(
            new Response(JSON.stringify({ status: 'ok' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }),
        );

        const result = await customFetch<{ data: unknown; status: number }>('/health', {
            method: 'GET',
        });

        expect(fetchMock).toHaveBeenCalledWith(
            'http://api.example.com/health',
            expect.objectContaining({ method: 'GET' }),
        );
        expect(result.data).toEqual({ status: 'ok' });
        expect(result.status).toBe(200);
    });

    it('レスポンスが失敗ステータスの場合は例外を送出する', async () => {
        fetchMock.mockResolvedValue(new Response(null, { status: 500, statusText: 'Error' }));

        await expect(customFetch('/health', { method: 'GET' })).rejects.toThrow(
            'API request failed: 500 Error',
        );
    });
});
