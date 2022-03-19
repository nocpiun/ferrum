import { ReactElement } from "react"

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
    itemList: ReactElement | null
    starredList: ReactElement | null
}

// Editor

export interface EditorProps {
    path: string
}

// ListItem Component

export interface ListItemProps {
    itemType: "folder" | "file"
    itemName: string
    itemSize: number
    itemInfo: string
    onClick: (e: any) => any
}

// StarredItem Component

export interface StarredItemProps {
    itemPath: string
}
