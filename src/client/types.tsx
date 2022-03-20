import React, { ReactElement } from "react"

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

export interface ExplorerHeaderProps {
    path: string
    onEnter: (e: React.KeyboardEvent) => any
    onStar: () => any
}

export interface ExplorerToolButtonsProps {
    onOpenFile: () => any
    onDeleteFile: () => any
    onRenameFile: () => any
    onDownloadFile: () => any
    onUploadFile: () => any
    onCreateFile: () => any
}

export interface ExplorerListProps {
    onBack: () => any
    itemList: React.ReactElement | null
}

export interface ExplorerLeftSidebarProps {
    starredList: React.ReactElement | null
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
    onClick: (e: HTMLButtonElement) => any
}

// StarredItem Component

export interface StarredItemProps {
    itemPath: string
}
