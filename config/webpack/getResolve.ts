import { ResolveOptions } from "webpack";
export const getResolve = (): ResolveOptions => {
    return {
        extensions: ['.tsx', '.ts', '.js']
    }
}