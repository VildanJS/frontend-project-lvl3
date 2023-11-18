import { type ResolveOptions } from "webpack";
export const getResolve = (path: string): ResolveOptions => {
    return {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path
        },
    }
}
