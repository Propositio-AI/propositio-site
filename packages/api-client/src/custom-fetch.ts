const DEFAULT_API_BASE_URL = 'http://localhost:8000';

type ApiClientConfig = {
    baseUrl: string;
};

type CustomFetchOptions = RequestInit & {
    params?: Record<string, unknown>;
};

const config: ApiClientConfig = {
    baseUrl: DEFAULT_API_BASE_URL,
};

/**

APIクライアントの接続先を設定する。
Web（Vite）とモバイル（Expo）では環境変数の読み方が異なるため、
各アプリのエントリポイントで起動時に1回だけ呼び出してベースURLを注入する。

@param options baseUrl（APIのベースURL。未指定・空文字の場合は既定値http://localhost:8000を使う）
@return なし

**/
export function configureApiClient(options: Partial<ApiClientConfig>): void {
    config.baseUrl = (options.baseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

/**

現在設定されているAPIのベースURLを取得する。

@param なし
@return APIのベースURL

**/
export function getApiBaseUrl(): string {
    return config.baseUrl;
}

/**

APIリクエストが失敗（2xx以外）した場合に送出されるエラー。
呼び出し側がステータスコードやバックエンドのエラーメッセージ（detail）で表示を切り替えられるようにする。

@param message エラーメッセージ、status HTTPステータスコード、detail バックエンドが返したdetail（文字列の場合のみ）
@return なし

**/
export class ApiRequestError extends Error {
    readonly status: number;
    readonly detail: string | undefined;

    /**

    ステータスコードとdetailを保持したエラーを生成する。

    @param message エラーメッセージ、status HTTPステータスコード、detail バックエンドが返したdetail
    @return なし

    **/
    constructor(message: string, status: number, detail?: string) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
        this.detail = detail;
    }
}

/**

失敗レスポンスのボディから、FastAPIのdetail（文字列）を取り出す。JSONでない場合はundefinedを返す。

@param response 失敗したfetchのレスポンス
@return detailの文字列。取り出せない場合はundefined

**/
async function readErrorDetail(response: Response): Promise<string | undefined> {
    try {
        const body: unknown = await response.json();
        if (
            body &&
            typeof body === 'object' &&
            'detail' in body &&
            typeof body.detail === 'string'
        ) {
            return body.detail;
        }
    } catch {
        // JSONでないエラーレスポンスはdetail無しとして扱う
    }
    return undefined;
}

/**

orvalが生成するAPIクライアントから呼び出される共通fetchラッパー。
ベースURLの解決と、orvalが期待する{ data, status, headers }形式への変換のみを担う薄い層。
Tはorvalが生成する「ステータスコード込みのレスポンス型」であるため、
実行時のstatusをそのまま詰めてTにキャストする。

@param url APIパス（例: "/health"）、options fetchに渡すオプション（method, body, headersなど）
@return { data, status, headers }形式のレスポンス（T型にキャスト済み）。2xx以外はApiRequestErrorを送出する

**/
export async function customFetch<T>(url: string, options: CustomFetchOptions): Promise<T> {
    const headers = new Headers(options.headers);
    if (options.body != null && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${config.baseUrl}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new ApiRequestError(
            `API request failed: ${response.status} ${response.statusText}`,
            response.status,
            await readErrorDetail(response),
        );
    }

    const data = response.status === 204 ? undefined : await response.json();

    return { data, status: response.status, headers: response.headers } as T;
}
