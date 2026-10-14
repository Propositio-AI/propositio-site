// Web（apps/web）とモバイル（apps/mobile）で共有するAPIクライアントのエントリポイント。
// アプリ側はこのパッケージ経由でのみバックエンドAPIにアクセスし、直接fetchしない。
export { ApiRequestError, configureApiClient, getApiBaseUrl } from './custom-fetch';
export * from './generated';
