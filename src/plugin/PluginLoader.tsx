import React from "react";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";

import * as Babel from "@babel/standalone";

import DialogBox from "../client/components/DialogBox";

import {
    PluginMetadata,
    ViewerOption,
    DialogOption,
    StyleOption,
    I18n,
    DirectoryItem,
    PluginSetupParameters
} from "../client/types";
import { version, pluginStorageKey } from "../client/global";
import Utils from "../Utils";
import LocalStorage from "../client/utils/localStorage";
import Logger from "../client/utils/logger";

const babelConfig = (babel: typeof Babel) => {
    return {
        presets: [babel.availablePresets["preset-react"]],
        plugins: [
            babel.availablePlugins["plugin-transform-react-jsx"],
            babel.availablePlugins["plugin-syntax-jsx"],
        ]
    }
};

/**
 * **Plugin Loader**
 * 
 * The core of plugin system,
 * which provides the registering, unregistering, loading of the plugins,
 * and supports JSX syntax (*.jsx).
 * 
 * The following is an example of a plugin:
 * 
 * @example
 * ```js
 * ({
 *   name: "example-plugin",
 *   displayName: "Example Plugin",
 *   setup() {
 *     console.log("HelloWorld");
 *   }
 * })
 * ```
 */
export default class PluginLoader {
    private static instance: PluginLoader | null;

    public pluginList: PluginMetadata[] = [];
    public viewerList: ViewerOption[] = [];
    public pluginI18nList: I18n[] = [];

    public static $i18n(str: string): string {
        const i18nRegexp = /^\$/;

        return i18nRegexp.test(str) ? Utils.$(str.replace("$", "")) : str;
    }

    private async init(): Promise<void> {
        Babel.registerPreset("preset-react", await import("@babel/preset-react"));
        Babel.registerPlugins({
            "plugin-transform-react-jsx": await import("@babel/plugin-transform-react-jsx"),
            "plugin-syntax-jsx": await import("@babel/plugin-syntax-jsx"),
        });
    }

    public register(plugin: PluginMetadata): void {
        // Query whether the name of plugin is duplicated.
        for(let i = 0; i < this.pluginList.length; i++) {
            if(this.pluginList[i].name == plugin.name) {
                Logger.error({ as: "PluginLoader", value: `Registering plugin "${plugin.name}" failed: Plugin ID isn't unique.` });
                toast.error(Utils.$("toast.msg23"));
                return;
            }
        }

        if(plugin.i18n) this.pluginI18nList.push(plugin.i18n);

        // If the plugin doesn't have a `displayName`,
        // then make the `displayName` equal to its `name`.
        plugin.displayName ??= plugin.name;
        this.pluginList.push(plugin);

        Logger.log({ as: "PluginLoader", value: `Plugin "${plugin.name}" is registered.` }, plugin);
    }

    public unregister(pluginId: string): void {
        var list = this.pluginList.splice(0);
        var index = -1;

        for(let i = 0; i < list.length; i++) {
            if(list[i].name == pluginId) {
                index = i;
            }
        }

        if(list[index].native) {
            Logger.error({ as: "PluginLoader", value: `Unregistering plugin "${pluginId}" failed: Unable to unregister a native plugin.` })
            toast.error(Utils.$("toast.msg24"));
            return;
        }

        if(index > -1) {
            this.unloadExternalPlugin(list[index]);
            
            list.splice(index, 1);

            this.pluginList = list;
            Logger.log({ as: "PluginLoader", value: `Plugin "${pluginId}" is unregistered.` });
        }
    }

    public load(): void {
        this.viewerList = [];

        const apis: PluginSetupParameters = {
            addViewer: PluginLoader.addViewer,
            addDialog: PluginLoader.addDialog,
            addStyle: PluginLoader.addStyle,
            getPath: PluginLoader.getPath,
            getItemList: PluginLoader.getItemList,
            getVersion: PluginLoader.getVersion,
            toast,
        };

        this.pluginList.forEach((plugin) => {
            if(plugin.setup) plugin.setup(apis);
        });
    }

    public async loadExternalPlugin(script: string): Promise<void> {
        var plugins = LocalStorage.getItem<string[]>(pluginStorageKey) ?? [];
        plugins.push(script);

        /**
         * In order to make the plugin system supports the JSX syntax,
         * we need to use Babel to compile the plugin sourcecode so that it can be run by `window.eval()`.
         * 
         * Also, inside the `window.eval()`, it hasn't improved React defaultly,
         * so we should do `window.React = React`.
         */

        // Register Babel presets & plugins
        if(Babel.availablePresets["preset-react"] == undefined) await this.init();
        // Transform jsx to js
        const compiled = Babel.transform(script, babelConfig(Babel));

        window.React = React; // Import React for the plugin
        this.register(window.eval(compiled.code ?? ""));
        this.load();

        LocalStorage.setItem<string[]>(pluginStorageKey, Utils.arrayDeduplicate(plugins));
    }

    public unloadExternalPlugin(plugin: PluginMetadata): void {
        var plugins = LocalStorage.getItem<string[]>(pluginStorageKey);
        if(!plugins) return;

        for(let i = 0; i < plugins.length; i++) {
            const script = plugins[i];
            // Transform jsx to js
            const compiled = Babel.transform(script, babelConfig(Babel));

            window.React = React; // Import React for the plugin
            const metadata = window.eval(compiled.code ?? "") as PluginMetadata;
            if(metadata.name == plugin.name) {
                plugins.splice(i, 1);
            }
        }

        LocalStorage.setItem<string[]>(pluginStorageKey, plugins);
    }

    /**
     * **addViewer**
     * 
     * Add a custom viewer to Ferrum Explorer.
     * 
     * @example
     * ```jsx
     * addViewer({
     *   id: "example-viewer",
     *   pageTitle: "Example Viewer",
     *   route: "/example-viewer",
     *   formats: [],
     *   render: (dataUrl) => <div>{dataUrl}</div>
     * });
     * ```
     * @api
     */
    private static addViewer(viewer: ViewerOption): void {
        PluginLoader.get().viewerList.push(viewer);
    }

    /**
     * **addDialog**
     * 
     * Add a custom dialog and an opening button of the dialog to Ferrum Explorer.
     * 
     * @example
     * ```jsx
     * addDialog({
     *   id: "example-dialog",
     *   icon: "data:image/svg+xml;base64,....",
     *   dialogTitle: "Example",
     *   onOpen: () => {
     *     // ...
     *   },
     *   render: () => {
     *     return <p>HelloWorld!</p>;
     *   }
     * });
     * ```
     * @api
     */
    private static addDialog(dialog: DialogOption): void {
        const navbar = Utils.getElem("navbar");

        var button = document.createElement("button");
        button.className = "header-button dialog-plugin-button";
        button.id = dialog.id +"--button";
        button.title = dialog.dialogTitle;
        button.style.backgroundImage = "url("+ dialog.icon +")";
        button.addEventListener("click", dialog.onOpen);
        navbar.appendChild(button);

        ReactDOM.render(DialogBox.createDialog(dialog.id,
            <DialogBox id={dialog.id} title={dialog.dialogTitle}>
                {dialog.render()}
            </DialogBox>
        ), document.getElementById("temp"));
    }

    /**
     * **addStyle**
     * 
     * Add a custom stylesheet to Ferrum Explorer.
     * 
     * @example
     * ```js
     * addStyle({
     *   id: "example-theme",
     *   css: "body {background: #000}"
     * });
     * ```
     * @api
     */
    private static addStyle(style: StyleOption): void {
        if(document.getElementById(style.id) != null) return;
        document.body.setAttribute("theme", style.id);

        var styleElem = document.createElement("style");
        styleElem.innerText = "/*Compressed*/"+ Utils.compressCSS(style.css);
        styleElem.id = style.id;
        document.head.appendChild(styleElem);
    }

    /**
     * **getPath**
     * 
     * Get the current path.
     * 
     * @example
     * ```js
     * var currentPath = getPath();
     * ```
     * @api
     */
    private static getPath(): string {
        return document.body.getAttribute("path") ?? "";
    }

    /**
     * **getItemList**
     * 
     * Get the current list of directory item.
     * 
     * @example
     * ```js
     * var list = getItemList();
     * ```
     * @api
     */
    private static getItemList(): DirectoryItem[] | null {
        if(!document.getElementById("list")) return null;

        var nodes = Utils.getElem("list").childNodes;
        var list: DirectoryItem[] = [];

        for(let i = 0; i < nodes.length; i++) {
            const item = nodes[i] as HTMLDivElement;
            const itemInfoStr = item.getAttribute("data-info");
            if(!itemInfoStr) continue;

            list.push(JSON.parse(itemInfoStr) as DirectoryItem);
        }

        return list;
    }

    /**
     * **getVersion**
     * 
     * Get the version of Ferrum Explorer.
     * 
     * @example
     * ```js
     * const version = getVersion();
     * ```
     * @api
     */
    private static getVersion(): string {
        return version;
    }

    public static get(): PluginLoader {
        if(!PluginLoader.instance) PluginLoader.instance = new PluginLoader();
        return PluginLoader.instance;
    }
}
