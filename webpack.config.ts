import path from 'path'
import { type Configuration } from 'webpack'
import { buildWebpackConfig } from "./config/webpack/buildWebpackConfig";
import {type ConfigOptions, type EnvOptions} from "./config/webpack/types/ConfigOptions";

export default (env: EnvOptions): Configuration => {
    const options: ConfigOptions = {
        mode: env.mode || 'development',
        paths: {
            entry: path.resolve(__dirname, 'src', 'index.ts'),
            output: path.resolve(__dirname, 'dist'),
            html: path.resolve(__dirname, 'public', 'index.html'),
            src: path.join(__dirname, 'src'),
        },
        port: env.port || 3000,
        isOpen: true
    }

    return buildWebpackConfig(options)
}
