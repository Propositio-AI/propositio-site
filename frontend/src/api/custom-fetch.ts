const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

type CustomFetchOptions = RequestInit & {
    params?: Record<string, unknown>;
};

/**

orvalが生成するAPIクライアントから呼び出される共通fetchラッパー。
ベースURLの解決と、orvalが期待する{ data, status, headers }形式への変換のみを担う薄い層。
Tはorvalが生成する「ステータスコード込みのレスポンス型」であるため、
実行時のstatusをそのまま詰めてTにキャストする。

@param url APIパス（例: "/tasks"）
@param options fetchに渡すオプション（method, body, headersなど）
@return { data, status, headers }形式のレスポンス（T型にキャスト済み）

**/
export async function customFetch<T>(url: string, options: CustomFetchOptions): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = response.status === 204 ? undefined : await response.json();

    return { data, status: response.status, headers: response.headers } as T;
}
