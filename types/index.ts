import _Drive from "node-disk-info/dist/classes/drive";

export interface PropsWithCN {
    className?: string;
}

export interface BaseResponseData {
    status: number
}

export interface DirectoryItem {
    name: string
    type: "folder" | "file"
    size: number
    access: boolean
}

export enum BytesType {
    B = 0,
    KB = 1,
    MB = 2,
    GB = 3,
    TB = 4
}

export interface Drive {
    readonly _filesystem: string
    readonly _blocks: number
    readonly _used: number
    readonly _available: number
    readonly _capacity: string
    readonly _mounted: string
}

export type SystemPlatform = "aix" | "darwin" | "freebsd" | "linux" | "openbsd" | "sunos" | "win32";
