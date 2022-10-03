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
    I18n
} from "../client/types";
import { pluginStorageKey } from "../client/global";
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

        this.pluginList.forEach((plugin, i) => {
            if(plugin.setup) plugin.setup({
                addViewer: PluginLoader.addViewer,
                addDialog: PluginLoader.addDialog,
                addStyle: PluginLoader.addStyle,
            });
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

    private static addViewer(viewer: ViewerOption): void { // API
        PluginLoader.get().viewerList.push(viewer);
    }

    private static addDialog(dialog: DialogOption): void { // API
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

    private static addStyle(style: StyleOption): void { // API
        if(document.getElementById(style.id) != null) return;
        document.body.setAttribute("theme", style.id);

        var styleElem = document.createElement("style");
        /** @see https://cdn.jsdelivr.net/npm/cssidjs@1.0.3/cssid.js line 42~52 */
        styleElem.innerText = "/*Compressed*/"
            + style.css
            .replaceAll("\n", "")
            .replace(/\/\*{1,2}[\s\S]*?\*\//g, "")
            .replace(/(\s*){/g, "{")
            .replace(/{(\s*)/g, "{")
            .replace(/}(\s*)/g, "}")
            .replace(/(\s*)}/g, "}")
            .replace(/:(\s*)/g, ":")
            .replace(/,(\s*)/g, ",")
            .replace(/(\n*)/g, "")
            .replace(/ {4}/g, "")
            .replace(/ {3}/g, "")
            .replace(/ {2}/g, "");
        styleElem.id = style.id;
        document.head.appendChild(styleElem);
    }

    public static get(): PluginLoader {
        if(!PluginLoader.instance) PluginLoader.instance = new PluginLoader();
        return PluginLoader.instance;
    }
}
