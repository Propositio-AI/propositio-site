const path = require('node:path');

/**

モジュールをモバイルアプリ（このディレクトリ）を起点に解決し、そのパッケージのディレクトリを返す。
Metroと同様に、workspaceパッケージからもアプリと同じReact / TanStack Queryを参照させるために使う。

@param moduleName 解決するモジュール名
@return 解決したパッケージのディレクトリの絶対パス

**/
function resolveFromApp(moduleName) {
    return path.dirname(require.resolve(`${moduleName}/package.json`));
}

module.exports = {
    preset: 'jest-expo',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^react$': resolveFromApp('react'),
        '^@tanstack/react-query$': resolveFromApp('@tanstack/react-query'),
    },
};
