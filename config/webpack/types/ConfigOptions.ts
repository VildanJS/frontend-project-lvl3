export type Mode = 'production' | 'development'
export interface Paths {
    entry: string,
    output: string,
    html: string,
    src: string,
    locales: string,
    distLocales: string
}
export interface ConfigOptions {
    mode: Mode,
    paths: Paths,
    port: number,
    isOpen: boolean
}

export interface EnvOptions {
    mode: Mode,
    port: number
}
