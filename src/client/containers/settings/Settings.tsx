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
import Toggle from "../../components/Toggle";

import MainContext from "../../contexts/MainContext";
import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
import PluginLoader from "../../../plugin/PluginLoader";
import { apiUrl, version } from "../../global";
import { Config, SettingsItem } from "../../types";

// icons
import folderOutline from "../../../icons/folder_outline.svg";
import editNote from "../../../icons/edit_note.svg";
import terminal from "../../../icons/terminal.svg";
import extension from "../../../icons/extension.svg";
import key from "../../../icons/key.svg";
import info from "../../../icons/info.svg";

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
                loading: Utils.$("toast.msg14"),
                success: Utils.$("toast.msg15"),
                error: Utils.$("toast.msg16")
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
            toast.error(Utils.$("toast.msg17"));
            return;
        }
    
        if(newPassword === "" || /[^a-zA-Z0-9]/g.test(newPassword)) {
            toast.error(Utils.$("toast.msg18"));
            return;
        }
    
        if(md5(newPassword) === config.explorer.password) {
            toast.error(Utils.$("toast.msg19"));
            return;
        }
    
        Utils.setCookie("fepw", md5(md5(newPassword)));
        toast.promise(Axios.post(apiUrl +"/setPassword", {
            oldPassword: md5(oldPassword),
            newPassword: md5(newPassword)
        }), {
            loading: Utils.$("toast.msg20"),
            success: Utils.$("toast.msg21"),
            error: Utils.$("toast.msg22")
        }).then(() => window.location.reload());
    };

    const handleLanguageChange = () => {
        Utils.setLanguage((Utils.getElem("settings-language") as HTMLSelectElement).value);
        window.location.reload();
    };

    const handleCheckUpdate = () => {
        return new Promise<string>(async (resolve, reject) => {
            const releases = await Axios.get<{
                tag_name: string
            }[]>("https://api.github.com/repos/NriotHrreion/ferrum/releases");
            const latestVersion = releases.data[0].tag_name;
    
            if(version === latestVersion) {
                resolve(Utils.$("toast.msg26"));
            } else {
                reject(Utils.$("toast.msg27") + latestVersion);
            }
        });
    };

    const refreshPluginList = () => {
        interface MenuItemData {
            pluginId: string
        }

        setPluginList(
            <>
                {PluginLoader.get().pluginList.map((plugin, i) => {
                    const $i18n = PluginLoader.$i18n;

                    return (
                        <ListGroup.Item title={$i18n(plugin.description ?? "") + (!plugin.native ? " "+ Utils.$("settings.plugin.tooltip") : "")} key={i}>
                            <ContextMenuTrigger id={"plugin-rcmenu--"+ plugin.name}>
                                <span className="plugin-name">{$i18n(plugin.displayName ?? "")}</span>
                                <span className="plugin-id">{plugin.name + (plugin.native ? " "+ Utils.$("settings.plugin.native") : "")}</span>
                            </ContextMenuTrigger>
                            {!plugin.native ? <ContextMenu id={"plugin-rcmenu--"+ plugin.name}>
                                <MenuItem
                                    data={{ pluginId: plugin.name } as MenuItemData}
                                    onClick={(e, data: MenuItemData) => {
                                        PluginLoader.get().unregister(data.pluginId);
                                        refreshPluginList();
                                    }}>{Utils.$("settings.plugin.uninstall")}</MenuItem>
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
                    <SidebarItem
                        id={SettingsItem.EXPLORER}
                        title={Utils.$("settings.explorer")}
                        icon={folderOutline}
                        onClick={(e) => handleItemBeOn(e)}
                        defaultValue={true}/>
                    <SidebarItem
                        id={SettingsItem.EDITOR}
                        title={Utils.$("settings.editor")}
                        icon={editNote}
                        onClick={(e) => handleItemBeOn(e)}/>
                    <SidebarItem
                        id={SettingsItem.TERMINAL}
                        title={Utils.$("settings.terminal")}
                        icon={terminal}
                        onClick={(e) => handleItemBeOn(e)}/>
                    <SidebarItem
                        id={SettingsItem.PLUGIN}
                        title={Utils.$("settings.plugin")}
                        icon={extension}
                        onClick={(e) => handleItemBeOn(e)}/>
                    <SidebarItem
                        id={SettingsItem.PASSWORD}
                        title={Utils.$("settings.password")}
                        icon={key}
                        onClick={(e) => handleItemBeOn(e)}/>
                    <SidebarItem
                        id={SettingsItem.ABOUT}
                        title={Utils.$("settings.about")}
                        icon={info}
                        onClick={(e) => handleItemBeOn(e)}/>
                </ul>
                <div className="add-plugin">
                    <input
                        id="plugin-uploader"
                        type="file"
                        style={{display: "none"}}
                        onChange={() => handleAddPlugin()}/>
                    <Button variant="secondary" onClick={() => Utils.getElem("plugin-uploader").click()}>
                        {Utils.$("settings.plugin.add")}
                    </Button>
                </div>
            </aside>
            <div className="settings-main">
                <Form>
                    <SettingsSection title={Utils.$("settings.explorer")} style={{display: currentPage == "s-explorer" ? "block" : "none"}}>
                        <Option name={Utils.$("settings.explorer.o1")} description={Utils.$("settings.explorer.o1.description")}>
                            <Form.Select id="settings-root" defaultValue={config.explorer.root}>
                                <option value="">{Utils.$("settings.explorer.o1.unixroot")}</option>
                                <option value="C:">C: ({Utils.$("global.default")})</option>
                                {["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B"].map((item, i) => {
                                    return <option value={item +":"} key={i}>{item +":"}</option>
                                })}
                            </Form.Select>
                        </Option>
                        <Option name={Utils.$("settings.explorer.o2")}>
                            <Toggle ref={displayHiddenFileToggle} id="settings-display-hidden-file" defaultValue={config.explorer.displayHiddenFile}/>
                        </Option>
                        <Option name={Utils.$("settings.explorer.o3")}>
                            <Form.Select
                                id="settings-language"
                                defaultValue={Utils.getLanguage()}
                                onChange={() => handleLanguageChange()}>
                                {Utils.getLanguages().map((item, i) => {
                                    return <option value={item} key={i}>{item}</option>
                                })}
                            </Form.Select>
                        </Option>
                    </SettingsSection>
                    <SettingsSection title={Utils.$("settings.editor")} style={{display: currentPage == "s-editor" ? "block" : "none"}}>
                        <Option name={Utils.$("settings.editor.o1")}>
                            <Toggle ref={lineNumberToggle} id="settings-line-number" defaultValue={config.editor.lineNumber}/>
                        </Option>
                        <Option name={Utils.$("settings.editor.o2")} description={Utils.$("settings.editor.o2.description")}>
                            <Toggle ref={autoWrapToggle} id="settings-auto-wrap" defaultValue={config.editor.autoWrap}/>
                        </Option>
                        <Option name={Utils.$("settings.editor.o3")} description={Utils.$("settings.editor.o3.description")}>
                            <Toggle ref={highlightActiveLineToggle} id="settings-highlight-active-line" defaultValue={config.editor.highlightActiveLine}/>
                        </Option>
                        <Option name={Utils.$("settings.editor.o4")}>
                            <Form.Select id="settings-font-size" defaultValue={config.editor.fontSize}>
                                <option value={12}>{Utils.$("settings.editor.o4.verysmall")}</option>
                                <option value={13}>{Utils.$("settings.editor.o4.small")}</option>
                                <option value={14}>{Utils.$("settings.editor.o4.middle")} ({Utils.$("global.default")})</option>
                                <option value={15}>{Utils.$("settings.editor.o4.large")}</option>
                                <option value={16}>{Utils.$("settings.editor.o4.verylarge")}</option>
                            </Form.Select>
                        </Option>
                    </SettingsSection>
                    <SettingsSection title={Utils.$("settings.terminal")} style={{display: currentPage == "s-terminal" ? "block" : "none"}}>
                        <Option name={Utils.$("settings.terminal.o1")}>
                            <Form.Control type="text" id="settings-ip" defaultValue={config.terminal.ip}/>
                        </Option>
                        <Option name={Utils.$("settings.terminal.o2")}>
                            <Form.Control type="text" id="settings-port" defaultValue={config.terminal.port}/>
                        </Option>
                        <Option name={Utils.$("settings.terminal.o3")}>
                            <Form.Control type="text" id="settings-username" defaultValue={config.terminal.username}/>
                        </Option>
                        <Option name={Utils.$("settings.terminal.o4")}>
                            <Form.Control type="password" id="settings-password" autoComplete="off" defaultValue={config.terminal.password}/>
                        </Option>
                    </SettingsSection>
                    <SettingsSection title={Utils.$("settings.plugin")} style={{display: currentPage == "s-plugin" ? "block" : "none"}}>
                        <ListGroup className="plugin-list">
                            {pluginList}
                        </ListGroup>
                    </SettingsSection>
                    <SettingsSection title={Utils.$("settings.password")} style={{display: currentPage == "s-password" ? "block" : "none"}}>
                        <Option name={Utils.$("settings.password.o1")}>
                            <Form.Control type="password" id="old-password" autoComplete="off" required/>
                        </Option>
                        <Option name={Utils.$("settings.password.o2")}>
                            <Form.Control type="password" id="new-password" autoComplete="off" required/>
                        </Option>
                        <Button className="submit" onClick={() => handleSetPassword()} disabled={isDemo}>
                            {Utils.$("settings.password.submit")}
                        </Button>
                    </SettingsSection>
                    <SettingsSection title={Utils.$("settings.about")} style={{display: currentPage == "s-about" ? "block" : "none"}}>
                        <p><b>{Utils.$("app.name")}</b> {Utils.$("app.description")}</p>
                        <Option name={Utils.$("settings.about.o1")}>
                            <span className="text">@nocp/ferrum-{version}</span>
                        </Option>
                        <Option name={Utils.$("settings.about.o2")}>
                            <span className="text">NoahHrreion</span>
                        </Option>
                        <Option name={Utils.$("settings.about.o3")}>
                            <span className="text">
                                <a href="https://github.com/NriotHrreion/ferrum" target="_blank" rel="noreferrer">NriotHrreion/ferrum</a>
                            </span>
                        </Option>
                        <Button variant="success" className="check-update" onClick={() => {
                            toast.promise(handleCheckUpdate(), {
                                loading: Utils.$("toast.msg25"),
                                success: (msg) => msg,
                                error: (msg) => msg
                            });
                        }}>{Utils.$("settings.about.checkupdate")}</Button>
                    </SettingsSection>
                </Form>
            </div>
        </div>
    );
}

export default Settings;
