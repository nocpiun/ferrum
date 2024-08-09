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
    used: number
    size: number
    capacity: number
    mount: string
}

export type SystemPlatform = "aix" | "darwin" | "freebsd" | "linux" | "openbsd" | "sunos" | "win32";

export interface FileType {
    id: string
    name: string
    extensions: string[]
}

export interface DirectoryItemOperations {
    rename: (name: string) => Promise<void>
    remove: () => Promise<void>
}

export type DisplayingMode = "list" | "grid";

export interface ViewProps {
    items: DirectoryItem[]
    error: string | null
    contextMenu: React.ReactNode
    onContextMenu: (event: React.UIEvent) => void
}

export interface ViewItemProps extends DirectoryItem {
    extname?: string
    selected: boolean
    contextMenu: React.ReactNode
    
    setSelected: (value: boolean) => void
    handleSelection: () => void
    handleOpen: () => void
    onContextMenu: (event: React.UIEvent) => void
}
