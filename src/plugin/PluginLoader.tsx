import React from "react";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";

import * as Babel from "@babel/standalone";

import DialogBox from "../client/components/DialogBox";

import {
    PluginMetadata,
    ViewerOption,
    DialogOption
} from "../client/types";
import { pluginStorageKey } from "../client/global";
import Utils from "../Utils";
import LocalStorage from "../client/utils/localStorage";
import Logger from "../client/utils/logger";

export default class PluginLoader {
    private static instance: PluginLoader | null;

    public pluginList: PluginMetadata[] = [];
    public viewerList: ViewerOption[] = [];

    private async init(): Promise<void> {
        Babel.registerPreset("preset-react", await import("@babel/preset-react"));
        Babel.registerPlugins({
            "plugin-transform-react-jsx": await import("@babel/plugin-transform-react-jsx"),
            "plugin-syntax-jsx": await import("@babel/plugin-syntax-jsx"),
        });
    }

    public register(plugin: PluginMetadata): void {
        for(let i = 0; i < this.pluginList.length; i++) {
            if(this.pluginList[i].name == plugin.name) {
                Logger.error({ as: "PluginLoader", value: `Registering plugin "${plugin.name}" failed: Plugin ID isn't unique.` });
                toast.error("插件注册失败: ID不唯一");
                return;
            }
        }

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
            toast.error("插件卸载失败: 无法卸载内置插件");
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
            });
        });
    }

    public async loadExternalPlugin(script: string): Promise<void> {
        var plugins = LocalStorage.getItem<string[]>(pluginStorageKey) ?? [];
        plugins.push(script);

        // Register Babel presets & plugins
        await this.init();
        // Transform jsx to js
        const compiled = Babel.transform(script, {
            presets: [Babel.availablePresets["preset-react"]],
            plugins: [
                Babel.availablePlugins["plugin-transform-react-jsx"],
                Babel.availablePlugins["plugin-syntax-jsx"],
            ]
        });

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
            const compiled = Babel.transform(script, {
                presets: [Babel.availablePresets["preset-react"]],
                plugins: [
                    Babel.availablePlugins["plugin-transform-react-jsx"],
                    Babel.availablePlugins["plugin-syntax-jsx"],
                ]
            });

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

    public static get(): PluginLoader {
        if(!PluginLoader.instance) PluginLoader.instance = new PluginLoader();
        return PluginLoader.instance;
    }
}
