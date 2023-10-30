import type { Configuration as DevServerConfiguration } from "webpack-dev-server"; 
export const getDevServerConfig = (port: number, isOpen: boolean): DevServerConfiguration => {
    return {
        port,
        open: isOpen
    }
}