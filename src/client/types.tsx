import React, { ReactElement } from "react"
import { Variant } from "react-bootstrap/esm/types"

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
    onCreateDirectory: () => any
}

export interface ExplorerListProps {
    onBack: () => any
    itemList: React.ReactElement | null
}

export interface ExplorerLeftSidebarProps {
    starredList: React.ReactElement | null
}

export interface ExplorerRightSidebarProps {
    path: string
}

export interface ExplorerRightSidebarState {
    alertBox1: boolean
    alertBox2: boolean
}

// Editor

export interface GetFileContentResponse {
    data: {format: string, content: string, err?: number}
}

export interface EditorProps {
    path: string
}

export interface EditorState {
    editorLanguage: string
    editorValue: string
}

export interface EditorHeaderProps {
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

// AlertBox Component

export interface AlertBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    variant: Variant
    heading: string
    alertId: number
}
