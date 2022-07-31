import React, { ReactElement } from "react"
import { Variant } from "react-bootstrap/esm/types"

// Global

interface PageProps {
    path: string
}

type DefaultCallback = () => any

export interface Config {
    explorer: {
        root: string
        password: string
        displayHiddenFile: boolean
    }
    editor: {
        lineNumber: boolean
        autoWrap: boolean
        highlightActiveLine: boolean
        fontSize: number
    }
    terminal: {
        ip: string
        port: number
        username: string
        password: string
    }
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

// Contexts

export interface MainContextType {
    isDemo: boolean
    config: Config
}

export interface DirectoryInfoContextType {
    path: string
    directoryItems: DirectoryItem[]
}

// Login Panel

export interface LoginPanelProps {
    isDemo: boolean
}

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
    direcotryItems: DirectoryItem[]
}

export interface ExplorerHeaderProps {
    path: string
    onEnter: (e: React.KeyboardEvent) => any
    onStar: DefaultCallback
    onBack: DefaultCallback
}

export enum SettingsItem {
    EXPLORER = "s-explorer",
    EDITOR = "s-editor",
    TERMINAL = "s-terminal",
    PLUGIN = "s-plugin",
}

export interface ExplorerSettingsSidebarItemProps {
    id: SettingsItem
    title: string
    icon: string
    defaultValue?: any
    onClick: (id: SettingsItem) => any
}

export interface ExplorerSettingsSectionProps {
    title: string
    style: React.CSSProperties
}

export interface ExplorerSettingsOptionProps {
    name: string
    description?: string
}

export interface ExplorerSettingsToggleProps {
    id: string
    defaultValue: boolean
    disabled?: boolean
}

export interface ExplorerSettingsToggleState {
    isOn: boolean
}

export interface ExplorerToolButtonsProps {
    onOpenFile: DefaultCallback
    onDeleteFile: DefaultCallback
    onDownloadFile: DefaultCallback
    onCreateFile: DefaultCallback
    onCreateDirectory: DefaultCallback
}

export interface ExplorerListProps {
    onBack: DefaultCallback
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
    onSaveFile: DefaultCallback
    onUndo: DefaultCallback
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
    title: string
    itemType: ItemType
    itemName: string
    itemDisplayName?: string | ReactElement
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
    id: string
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

export interface ViewerProps extends PageProps {
    viewerMetadata: ViewerOption
}

export interface ViewerState {
    viewerComponent: React.ReactElement | null;
}

interface PluginSetupParameters {
    addViewer: (viewer: ViewerOption) => void
    addDialog: (dialog: DialogOption) => void
}

export interface PluginMetadata {
    name: string
    displayName?: string
    setup: (params: PluginSetupParameters) => any
}

interface FunctionalOption {
    id: string
}

export interface ViewerOption extends FunctionalOption {
    pageTitle: string
    route: string
    formats: string[]
    render: (dataUrl: string) => ReactElement
}

export interface DialogOption extends FunctionalOption {
    icon: string
    dialogTitle: string
    onOpen: DefaultCallback
    render: () => ReactElement
}
