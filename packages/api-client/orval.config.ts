import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: '../../openapi.json',
        output: {
            // workspaceを指定すると、生成物をすべて再exportする src/generated/index.ts も生成される
            workspace: './src/generated',
            target: './endpoints.ts',
            schemas: './models',
            client: 'react-query',
            httpClient: 'fetch',
            mode: 'tags-split',
            clean: true,
            override: {
                mutator: {
                    path: '../custom-fetch.ts',
                    name: 'customFetch',
                },
            },
        },
    },
});
