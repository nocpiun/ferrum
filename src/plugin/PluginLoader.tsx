import ReactDOM from "react-dom";
import toast from "react-hot-toast";

import DialogBox from "../client/components/DialogBox";

import {
    PluginMetadata,
    ViewerOption,
    DialogOption
} from "../client/types";
import { pluginStorageKey } from "../client/global";
import Utils from "../Utils";
import LocalStorage from "../client/utils/localStorage";

export default class PluginLoader {
    private static instance: PluginLoader | null;

    public pluginList: PluginMetadata[] = [];
    public viewerList: ViewerOption[] = [];

    public register(plugin: PluginMetadata): void {
        for(let i = 0; i < this.pluginList.length; i++) {
            if(this.pluginList[i].name == plugin.name) {
                console.error(`[PluginLoader] Registering plugin "${plugin.name}" failed: Plugin ID isn't unique.`);
                toast.error("插件注册失败: ID不唯一");
                return;
            }
        }

        plugin.displayName ??= plugin.name;
        this.pluginList.push(plugin);

        console.log(`[PluginLoader] Plugin "${plugin.name}" is registered.`, plugin);
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
            console.error(`[PluginLoader] Unregistering plugin "${pluginId}" failed: Unable to unregister a native plugin.`)
            toast.error("插件卸载失败: 无法卸载内置插件");
            return;
        }

        if(index > -1) {
            this.unloadExternalPlugin(list[index]);
            
            list.splice(index, 1);

            this.pluginList = list;
            console.log(`[PluginLoader] Plugin "${pluginId}" is unregistered.`);
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

    public loadExternalPlugin(script: string): void {
        var plugins = LocalStorage.getItem<string[]>(pluginStorageKey) ?? [];
        plugins.push(script)

        this.register(eval(script));
        this.load();

        LocalStorage.setItem<string[]>(pluginStorageKey, Utils.arrayDeduplicate(plugins));
    }

    public unloadExternalPlugin(plugin: PluginMetadata): void {
        var plugins = LocalStorage.getItem<string[]>(pluginStorageKey);
        if(!plugins) return;

        for(let i = 0; i < plugins.length; i++) {
            if((eval(plugins[i]) as PluginMetadata).name == plugin.name) {
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
