import {type RuleSetRule} from "webpack";
import autoprefixer from "autoprefixer";

export const getLoaders = (): RuleSetRule[] => {
    const typeScriptLoader = {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
    }
    const styleLoader = {
        test: /\.(scss)$/,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader'
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            autoprefixer
                        ]
                    }
                }
            },
            {
                loader: 'sass-loader'
            },]
    }
    return [typeScriptLoader, styleLoader]
}
