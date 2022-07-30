import ReactDOM from "react-dom";

import DialogBox from "../client/components/DialogBox";

import {
    PluginMetadata,
    ViewerOption,
    DialogOption
} from "../client/types";
import Utils from "../Utils";

export default class PluginLoader {
    private static instance: PluginLoader | null;

    public pluginList: PluginMetadata[] = [];
    public viewerList: ViewerOption[] = [];

    public register(metadata: PluginMetadata): void {
        metadata.displayName ??= metadata.name;
        this.pluginList.push(metadata);
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
