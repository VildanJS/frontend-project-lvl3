import HtmlWebpackPlugin from "html-webpack-plugin";
import {WebpackPluginInstance, ProgressPlugin} from "webpack";

export const getPlugins = (htmlPath: string): WebpackPluginInstance[] => {
    return [
        new HtmlWebpackPlugin({
            template: htmlPath
        }),
        new ProgressPlugin({
            percentBy: null,
        })
    ]
}