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
