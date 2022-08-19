import React, { ReactElement } from "react"
import { Variant } from "react-bootstrap/esm/types"

// Global

interface PageProps {
    path: string
}

type DefC = () => any // Default Callback
type OPC<P, RT = any> = (param: P) => RT // One Parameter Callback

interface Response<C> { // XHR Response
    data: C & { err?: number }
}

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
    isZipFile: boolean
}

// Login Panel

export interface LoginPanelProps {
    isDemo: boolean
}

export interface LoginPanelState {
    isEnterDisabled: boolean
}

// Explorer

export type FetchDirInfoResponse = Response<{
    list: DirectoryItem[]
}>

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
    onEnter: OPC<React.KeyboardEvent>
    onStar: DefC
    onBack: DefC
}

export enum SettingsItem {
    EXPLORER = "s-explorer",
    EDITOR = "s-editor",
    TERMINAL = "s-terminal",
    PLUGIN = "s-plugin",
    PASSWORD = "s-password",
    ABOUT = "s-about",
}

export interface ExplorerSettingsSidebarItemProps {
    id: SettingsItem
    title: string
    icon: string
    defaultValue?: any
    onClick: OPC<SettingsItem>
}

export interface ExplorerSettingsSectionProps {
    title: string
    style: React.CSSProperties
}

export interface ExplorerSettingsOptionProps {
    name: string
    description?: string
}

export interface ExplorerToolButtonsProps {
    onOpenFile: DefC
    onDeleteFile: DefC
    onDownloadFile: DefC
    onCreateFile: DefC
    onCreateDirectory: DefC
}

export interface ExplorerListProps {
    onBack: DefC
    itemList: React.ReactElement | null
}

export interface ExplorerLeftSidebarProps {
    starredList: React.ReactElement | null
}

export interface ExplorerLeftSidebarPanelProps {
    title: string
    id: string
}

export interface ExplorerRightSidebarProps {
    path: string
}

export interface ExplorerRightSidebarState {
    sysInfo: SysInfo | null
}

export interface ExplorerRightSidebarPanelProps {
    title?: string
    id: string
}

// Editor

export type GetFileContentResponse = Response<{
    format: string
    content: string
}>

export interface EditorProps extends PageProps {}

export interface EditorState {
    editorLanguage: string
    editorValue: string
}

export interface EditorHeaderProps {
    path: string
    onSaveFile: DefC
    onUndo: DefC
}

// Picture Viewer

export type GetDataUrlResponse = Response<{
    bdata: string
    type: string
}>

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
    disabled?: boolean
    onSelect: OPC<DirectoryItem>
    onUnselect: OPC<DirectoryItem>
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

// Toggle Component

export interface ToggleProps {
    id: string
    defaultValue: boolean
    disabled?: boolean
}

export interface ToggleState {
    isOn: boolean
}

// Plugin

export interface ViewerProps extends PageProps {
    viewerMetadata: ViewerOption
}

export interface ViewerState {
    viewerComponent: React.ReactElement | null;
}

interface PluginSetupParameters {
    addViewer: OPC<ViewerOption, void>
    addDialog: OPC<DialogOption, void>
}

export interface PluginMetadata {
    name: string
    displayName?: string
    description?: string
    setup: OPC<PluginSetupParameters>
    i18n?: I18n
    native?: boolean
}

interface FunctionalOption {
    id: string
}

interface ViewerHeaderButton {
    text: string
    shortcut: string
    action: DefC
}

export interface ViewerOption extends FunctionalOption {
    pageTitle: string
    route: string
    formats: string[]
    render: (dataUrl: string, type: string) => ReactElement
    headerButtons?: ViewerHeaderButton[]
}

export interface DialogOption extends FunctionalOption {
    icon: string
    dialogTitle: string
    onOpen: DefC
    render: () => ReactElement
}

export interface I18n {
    [lang: string]: { [key: string]: string }
}
