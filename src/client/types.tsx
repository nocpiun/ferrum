import React, { ReactElement } from "react"
import { Variant } from "react-bootstrap/esm/types"

// Global

interface PageProps {
    path: string
}

interface SysInfo {
    system: string
    version: string
    platform: string
    arch: string
    userInfo: {
        username: string
        homedir: string
    }
}

// Explorer

export interface FetchDirInfoResponse {
    data: {list: DirectoryItem[], err?: number}
}

export interface FetchSysInfoResponse {
    data: SysInfo
}

export interface DirectoryItem {
    isDirectory: boolean
    isFile: boolean
    fullName: string
    format?: string
    size?: number
}

export interface ExplorerProps extends PageProps {}

export interface ExplorerState {
    itemSelected: DirectoryItem | null
    itemList: ReactElement | null
    starredList: ReactElement | null
}

export interface ExplorerHeaderProps {
    path: string
    onEnter: (e: React.KeyboardEvent) => any
    onStar: () => any
    onSetPassword: () => any
}

export interface ExplorerToolButtonsProps {
    onOpenFile: () => any
    onDeleteFile: () => any
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
    alertBox3: boolean

    sysInfo: SysInfo | null
}

// Editor

export interface GetFileContentResponse {
    data: {format: string, content: string, err?: number}
}

export interface EditorProps extends PageProps {}

export interface EditorState {
    editorLanguage: string
    editorValue: string
}

export interface EditorHeaderProps {
    path: string
}

// Picture Viewer

export interface GetDataUrlResponse {
    data: {bdata: string, err?: number}
}

export interface PictureViewerProps extends PageProps {}

export interface PictureViewerState {
    pictureData: string
}

export interface PictureViewerHeaderProps {
    path: string
}

// ListItem Component

export interface ListItemProps {
    itemType: "folder" | "file"
    itemName: string
    itemSize: number
    itemInfo: string
    itemPath: string // The path don't have the file name
    onClick: (e: HTMLButtonElement) => any
}

export interface ListItemState {
    isRenaming: boolean
    isSelected: boolean
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

// Plugin

export interface FerrumPluginProps extends PageProps {}

export interface FerrumPluginState {
    viewerComponent: React.ReactElement | null;
}

export interface FerrumPluginOption {
    name: string
    title: string
    format: string[]
    route: string
    self: React.ComponentType<any>
}
