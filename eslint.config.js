import js from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// pnpm workspace全体（apps/* と packages/*）で共有するESLint設定。
// 各パッケージの `pnpm lint`（eslint .）からも、ルートの `pnpm lint` からもこのファイルが使われる。
export default tseslint.config(
    {
        ignores: [
            '**/dist',
            '**/node_modules',
            '**/coverage',
            'services',
            'packages/api-client/src/generated',
            'apps/mobile/.expo',
            'apps/mobile/ios',
            'apps/mobile/android',
            'apps/mobile/expo-env.d.ts',
        ],
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            importX.flatConfigs.recommended,
            importX.flatConfigs.typescript,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2023,
        },
        settings: {
            'import-x/resolver-next': [
                createTypeScriptImportResolver({
                    project: [
                        'apps/web/tsconfig.app.json',
                        'apps/web/tsconfig.node.json',
                        'apps/mobile/tsconfig.json',
                        'packages/*/tsconfig.json',
                    ],
                    // web / mobile / api-clientでtsconfigが分かれているのは意図した構成のため警告を抑制する
                    noWarnOnMultipleProjects: true,
                }),
            ],
        },
        plugins: {
            'react-hooks': reactHooks,
        },
        rules: {
            // v7のrecommendedはReact Compiler由来のルール（purity / refs / immutability等）も含む
            ...reactHooks.configs.flat.recommended.rules,
            'import-x/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                    ],
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'after',
                        },
                    ],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import-x/no-duplicates': 'error',
        },
    },
    // Web（Vite + React）
    {
        files: ['apps/web/**/*.{ts,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
    // shadcn/uiが生成するコンポーネントはvariants（cva）も同じファイルからexportする規約のため除外する
    {
        files: ['apps/web/src/components/ui/**/*.tsx'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
    // モバイル（Expo / React Native）
    {
        files: ['apps/mobile/**/*.{ts,tsx}'],
        languageOptions: {
            globals: { ...globals.browser, process: 'readonly' },
        },
        rules: {
            // 画面はネイティブコンポーネントで実装する（WebViewでWeb版を埋め込まない）
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'react-native-webview',
                            message:
                                'WebViewは使わず、ネイティブコンポーネントで実装してください。',
                        },
                        {
                            name: '@expo/dom-webview',
                            message:
                                'WebViewは使わず、ネイティブコンポーネントで実装してください。',
                        },
                    ],
                },
            ],
            'no-restricted-syntax': [
                'error',
                {
                    selector: "Program > ExpressionStatement > Literal[value='use dom']",
                    message:
                        "Expo DOMコンポーネント（'use dom'）はWebViewで描画されるため使用禁止です。",
                },
            ],
        },
    },
    {
        files: ['apps/mobile/**/*.test.{ts,tsx}'],
        languageOptions: {
            globals: globals.jest,
        },
    },
    // Web / Expo共通のAPIクライアント
    {
        files: ['packages/api-client/**/*.ts'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
    },
    // Metro / Jest / Babelなど、Node上で動くCommonJSの設定ファイル
    {
        files: ['**/*.config.cjs', 'apps/mobile/*.config.js'],
        extends: [js.configs.recommended],
        languageOptions: {
            sourceType: 'commonjs',
            globals: globals.node,
        },
    },
    eslintConfigPrettier,
);
