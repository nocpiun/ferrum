// Explorer

export interface FetchDirInfoResponse {
    data: {list: DirectoryItem[], err?: number}
}

export interface DirectoryItem {
    isDirectory: boolean
    isFile: boolean
    fullName: string
    format?: string
    size?: number
}

export interface ExplorerProps {
    path: string
}

export interface ExplorerState {
    itemSelected: DirectoryItem | null
}

// Editor

export interface EditorProps {
    path: string
}
