import HtmlWebpackPlugin from "html-webpack-plugin";
import {type WebpackPluginInstance, ProgressPlugin} from "webpack";
import { type Paths } from './types/ConfigOptions'
import CopyPlugin from 'copy-webpack-plugin'


export const getPlugins = (paths: Paths): WebpackPluginInstance[] => {
    const {locales, distLocales, html: htmlPath} = paths
    return [
        new HtmlWebpackPlugin({
            template: htmlPath
        }),
        new ProgressPlugin({
            percentBy: null,
        }),
        new CopyPlugin({
            patterns: [
                { from: locales, to: distLocales },
            ]
        }),
    ]
}
