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
}

export enum BytesType {
    B = 0,
    KB = 1,
    MB = 2,
    GB = 3,
    TB = 4
}
