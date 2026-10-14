const path = require('node:path');

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// workspaceパッケージ（@repo/api-client）が自身のnode_modulesから別インスタンスの
// React / TanStack Queryを読み込まないよう、これらは常にこのアプリから解決する。
const SINGLETON_MODULES = ['react', 'react-native', '@tanstack/react-query'];
const APP_ORIGIN = path.join(__dirname, 'package.json');

/**

シングルトンにすべきモジュールかどうかを判定する。

@param moduleName import対象のモジュール名
@return シングルトン対象ならtrue

**/
function isSingletonModule(moduleName) {
    return SINGLETON_MODULES.some(
        (name) => moduleName === name || moduleName.startsWith(`${name}/`),
    );
}

/**

Metroのモジュール解決をラップし、シングルトン対象のモジュールだけ
解決の起点をモバイルアプリのディレクトリに差し替える。

@param context Metroの解決コンテキスト、moduleName import対象のモジュール名、platform 対象プラットフォーム
@return Metroの解決結果

**/
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (isSingletonModule(moduleName)) {
        return context.resolveRequest(
            { ...context, originModulePath: APP_ORIGIN },
            moduleName,
            platform,
        );
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
