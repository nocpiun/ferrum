/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    ReactElement,
    useState,
    useContext,
    useRef,
    useEffect
} from "react";
import { Form, ListGroup, Button } from "react-bootstrap";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Axios from "axios";
import md5 from "md5-node";
import toast from "react-hot-toast";

import SidebarItem from "./SidebarItem";
import SettingsSection from "./SettingsSection";
import Option from "./Option";
import Toggle from "./Toggle";

import MainContext from "../../contexts/MainContext";
import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
import PluginLoader from "../../../plugin/PluginLoader";
import { apiUrl } from "../../global";
import { Config, SettingsItem } from "../../types";

// icons
import folderOutline from "../../../icons/folder_outline.svg";
import editNote from "../../../icons/edit_note.svg";
import terminal from "../../../icons/terminal.svg";
import extension from "../../../icons/extension.svg";
import key from "../../../icons/key.svg";

const Settings: React.FC = () => {
    const [currentPage, setPage] = useState<SettingsItem>(SettingsItem.EXPLORER);
    const [pluginList, setPluginList] = useState<ReactElement>(<></>);

    const displayHiddenFileToggle = useRef<Toggle | null>(null);
    const lineNumberToggle = useRef<Toggle | null>(null);
    const autoWrapToggle = useRef<Toggle | null>(null);
    const highlightActiveLineToggle = useRef<Toggle | null>(null);

    const { isDemo, config } = useContext(MainContext);

    function getInputElem(id: string): HTMLInputElement {
        return Utils.getElem(id) as HTMLInputElement;
    }

    const handleSave = () => {
        if(
            !displayHiddenFileToggle.current ||
            !lineNumberToggle.current ||
            !autoWrapToggle.current ||
            !highlightActiveLineToggle.current ||
            isDemo
        ) return;

        var newConfig: Config = {
            explorer: {
                root: getInputElem("settings-root").value,
                password: config.explorer.password,
                displayHiddenFile: displayHiddenFileToggle.current.getStatus()
            },
            editor: {
                lineNumber: lineNumberToggle.current.getStatus(),
                autoWrap: autoWrapToggle.current.getStatus(),
                highlightActiveLine: highlightActiveLineToggle.current.getStatus(),
                fontSize: parseInt((Utils.getElem("settings-font-size") as HTMLSelectElement).value)
            },
            terminal: {
                ip: getInputElem("settings-ip").value,
                port: parseInt(getInputElem("settings-port").value),
                username: getInputElem("settings-username").value,
                password: getInputElem("settings-password").value
            }
        };

        // Only when the config is changed,
        // the app posts the new config to the backend server
        if(!Utils.isObjectEqual<Config>(config, newConfig)) {
            toast.promise(Axios.post(apiUrl +"/setConfig", {
                config: newConfig
            }), {
                loading: "保存中...",
                success: "保存成功",
                error: "保存失败"
            }).then(() => window.location.reload());
        }
    };

    const handleItemBeOn = (id: SettingsItem) => {
        Emitter.get().emit("settingsItemSelect", id);

        setPage(id);
    };

    const handleAddPlugin = async () => {
        const uploader = Utils.getElem("plugin-uploader") as HTMLInputElement;

        if(uploader.files) {
            var pl = PluginLoader.get();
            
            var script = await uploader.files[0].text();
            await pl.loadExternalPlugin(script);

            refreshPluginList();
            uploader.files = null;
        }
    };

    const handleSetPassword = () => {
        if(isDemo) return;

        var oldPassword = (Utils.getElem("old-password") as HTMLInputElement).value;
        var newPassword = (Utils.getElem("new-password") as HTMLInputElement).value;
    
        if(md5(oldPassword) !== config.explorer.password) {
            toast.error("旧密码输入错误");
            return;
        }
    
        if(newPassword === "" || /[^a-zA-Z0-9]/g.test(newPassword)) {
            toast.error("密码更改失败，请输入有效密码");
            return;
        }
    
        if(md5(newPassword) === config.explorer.password) {
            toast.error("密码更改失败, 新密码与旧密码不能相同");
            return;
        }
    
        Utils.setCookie("fepw", md5(md5(newPassword)));
        toast.promise(Axios.post(apiUrl +"/setPassword", {
            oldPassword: md5(oldPassword),
            newPassword: md5(newPassword)
        }), {
            loading: "更改中...",
            success: "更改成功",
            error: "更改失败"
        }).then(() => window.location.reload());
    };

    const refreshPluginList = () => {
        interface MenuItemData {
            pluginId: string
        }

        setPluginList(
            <>
                {PluginLoader.get().pluginList.map((plugin, i) => {
                    return (
                        <ListGroup.Item title={(plugin.description ?? "") + (!plugin.native ? " (右键卸载插件)" : "")} key={i}>
                            <ContextMenuTrigger id={"plugin-rcmenu--"+ plugin.name}>
                                <span className="plugin-name">{plugin.displayName}</span>
                                <span className="plugin-id">{plugin.name + (plugin.native ? " (内置)" : "")}</span>
                            </ContextMenuTrigger>
                            {!plugin.native ? <ContextMenu id={"plugin-rcmenu--"+ plugin.name}>
                                <MenuItem
                                    data={{ pluginId: plugin.name } as MenuItemData}
                                    onClick={(e, data: MenuItemData) => {
                                        PluginLoader.get().unregister(data.pluginId);
                                        refreshPluginList();
                                    }}>卸载插件</MenuItem>
                            </ContextMenu> : null}
                        </ListGroup.Item>
                    );
                })}
            </>
        );
    };

    useEffect(() => {
        refreshPluginList();

        // Reset the config list when the user close the dialog
        Emitter.get().on("dialogClose", (dialogId: string) => {
            if(dialogId === "settings") handleSave();
        });

        // Save the config with ctrl+s
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key == "s") {
                e.preventDefault();
                handleSave();
            }
        });
    }, [config]);
    
    return (
        <div className="settings-dialog">
            <aside className="settings-sidebar">
                <ul>
                    <SidebarItem id={SettingsItem.EXPLORER} title="文件管理器" icon={folderOutline} onClick={(e) => handleItemBeOn(e)} defaultValue={true}/>
                    <SidebarItem id={SettingsItem.EDITOR} title="编辑器" icon={editNote} onClick={(e) => handleItemBeOn(e)}/>
                    <SidebarItem id={SettingsItem.TERMINAL} title="终端配置" icon={terminal} onClick={(e) => handleItemBeOn(e)}/>
                    <SidebarItem id={SettingsItem.PLUGIN} title="插件列表" icon={extension} onClick={(e) => handleItemBeOn(e)}/>
                    <SidebarItem id={SettingsItem.PASSWORD} title="密码设置" icon={key} onClick={(e) => handleItemBeOn(e)}/>
                </ul>
                <div className="add-plugin">
                    <input
                        id="plugin-uploader"
                        type="file"
                        style={{display: "none"}}
                        onChange={() => handleAddPlugin()}/>
                    <Button variant="secondary" onClick={() => Utils.getElem("plugin-uploader").click()}>添加插件</Button>
                </div>
            </aside>
            <div className="settings-main">
                <Form>
                    <SettingsSection title="文件管理器" style={{display: currentPage == "s-explorer" ? "block" : "none"}}>
                        <Option name="根目录" description="Unix系统应选择'(Unix系统根目录)'">
                            <Form.Select id="settings-root" defaultValue={config.explorer.root}>
                                <option value="">(Unix系统根目录)</option>
                                <option value="C:">C: (默认)</option>
                                {["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B"].map((item, i) => {
                                    return <option value={item +":"} key={i}>{item +":"}</option>
                                })}
                            </Form.Select>
                        </Option>
                        <Option name="显示隐藏文件">
                            <Toggle ref={displayHiddenFileToggle} id="settings-display-hidden-file" defaultValue={config.explorer.displayHiddenFile}/>
                        </Option>
                    </SettingsSection>
                    <SettingsSection title="编辑器" style={{display: currentPage == "s-editor" ? "block" : "none"}}>
                        <Option name="显示行数">
                            <Toggle ref={lineNumberToggle} id="settings-line-number" defaultValue={config.editor.lineNumber}/>
                        </Option>
                        <Option name="自动换行" description="当一行字的长度超过编辑器宽度时, 自动换行">
                            <Toggle ref={autoWrapToggle} id="settings-auto-wrap" defaultValue={config.editor.autoWrap}/>
                        </Option>
                        <Option name="活动行高亮" description="使当前光标所在的行高亮">
                            <Toggle ref={highlightActiveLineToggle} id="settings-highlight-active-line" defaultValue={config.editor.highlightActiveLine}/>
                        </Option>
                        <Option name="字体大小">
                            <Form.Select id="settings-font-size" defaultValue={config.editor.fontSize}>
                                <option value={12}>特小</option>
                                <option value={13}>小</option>
                                <option value={14}>中 (默认)</option>
                                <option value={15}>大</option>
                                <option value={16}>特大</option>
                            </Form.Select>
                        </Option>
                    </SettingsSection>
                    <SettingsSection title="终端配置" style={{display: currentPage == "s-terminal" ? "block" : "none"}}>
                        <Option name="IP 地址">
                            <Form.Control type="text" id="settings-ip" defaultValue={config.terminal.ip}/>
                        </Option>
                        <Option name="端口">
                            <Form.Control type="text" id="settings-port" defaultValue={config.terminal.port}/>
                        </Option>
                        <Option name="用户名">
                            <Form.Control type="text" id="settings-username" defaultValue={config.terminal.username}/>
                        </Option>
                        <Option name="密码">
                            <Form.Control type="password" id="settings-password" autoComplete="off" defaultValue={config.terminal.password}/>
                        </Option>
                    </SettingsSection>
                    <SettingsSection title="插件列表" style={{display: currentPage == "s-plugin" ? "block" : "none"}}>
                        <ListGroup className="plugin-list">
                            {pluginList}
                        </ListGroup>
                    </SettingsSection>
                    <SettingsSection title="密码设置" style={{display: currentPage == "s-password" ? "block" : "none"}}>
                        <Option name="旧密码">
                            <Form.Control type="password" id="old-password" autoComplete="off" required/>
                        </Option>
                        <Option name="新密码">
                            <Form.Control type="password" id="new-password" autoComplete="off" required/>
                        </Option>
                        <Button className="submit" onClick={() => handleSetPassword()} disabled={isDemo}>提交</Button>
                    </SettingsSection>
                </Form>
            </div>
        </div>
    );
}

export default Settings;
