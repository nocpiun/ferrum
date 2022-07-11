import React, { ReactElement } from "react"
import { Variant } from "react-bootstrap/esm/types"

// Global

interface PageProps {
    path: string
}

export interface SysInfo {
    system: string
    version: string
    platform: string
    arch: string
    userInfo: {
        username: string
        homedir: string
    }
    memory: {
        total: number
        free: number
    }
    cpuUsage: number
    upTime: number
}

// Login Panel

export interface LoginPanelState {
    isEnterDisabled: boolean
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
    itemSelected: DirectoryItem[]
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
    onDownloadFile: () => any
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
    hasChanged: boolean
}

export interface EditorHeaderProps {
    path: string
    onSaveFile: () => any
    onUndo: () => any
}

export interface EditorHeaderState {
    hasChanged: boolean
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

export enum ItemType {
    FOLDER = "folder", FILE = "file"
}

export interface ListItemProps {
    itemType: ItemType
    itemName: string
    itemSize: number
    itemInfo: string
    itemPath: string // The path don't have the file name
    onSelect: (item: DirectoryItem) => any
    onUnselect: (item: DirectoryItem) => any
}

// export interface ListItemState {
//     isRenaming: boolean
//     isSelected: boolean
// }

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

// DialogBox Component

export interface DialogBoxProps {
    title: string
}

export interface DialogBoxState {
    isOpen: boolean
}

// Bar Component

export interface BarState {
    value: number
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
