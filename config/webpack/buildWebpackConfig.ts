import { type ConfigOptions } from "./types/ConfigOptions";
import { type Configuration } from "webpack";
import { getLoaders } from "./getLoaders";
import { getResolve } from "./getResolve";
import { getPlugins } from "./getPlugins";

import {getDevServerConfig} from "./getDevServerConfig";

export const buildWebpackConfig = (options: ConfigOptions): Configuration => {
    const { mode, paths, port, isOpen } = options;
    const isDev = mode === 'development';
    return {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name].[contenthash].main.js',
            path: paths.output,
            clean: isDev && true,
            publicPath: '/'
        },
        module: {
            rules: getLoaders()
        },
        resolve: getResolve(paths.src),
        plugins: getPlugins(paths),
        devServer: isDev ? getDevServerConfig(port, isOpen) : undefined,
        devtool: isDev ? 'inline-source-map' : undefined,
    }
}
