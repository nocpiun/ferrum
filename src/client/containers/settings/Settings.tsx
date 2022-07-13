/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Axios from "axios";
import toast from "react-hot-toast";

import SettingsSection from "./SettingsSection";
import Option from "./Option";
import Toggle from "./Toggle";

import MainContext from "../../contexts/MainContext";
import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
import { apiUrl } from "../../global";
import { Config } from "../../types";

const Settings: React.FC = () => {
    const lineNumberToggle = useRef<Toggle | null>(null);
    const autoWrapToggle = useRef<Toggle | null>(null);
    const highlightActiveLineToggle = useRef<Toggle | null>(null);

    const { isDemo, config } = useContext(MainContext);

    function getInputElem(id: string): HTMLInputElement {
        return Utils.getElem(id) as HTMLInputElement;
    }

    const handleSave = () => {
        if(
            !lineNumberToggle.current ||
            !autoWrapToggle.current ||
            !highlightActiveLineToggle.current ||
            isDemo
        ) return;

        var newConfig: Config = {
            explorer: {
                root: getInputElem("settings-root").value,
                password: config.explorer.password
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

        toast.promise(Axios.post(apiUrl +"/setConfig", {
            config: newConfig
        }), {
            loading: "保存中...",
            success: "保存成功",
            error: "保存失败"
        }).then(() => window.location.reload());
    };

    useEffect(() => {
        // Reset the config list when the user close the dialog
        Emitter.get().on("dialogClose", (dialogTitle: string) => {
            if(dialogTitle == "设置") {
                getInputElem("settings-root").value = config.explorer.root;
                
                lineNumberToggle.current?.setStatus(config.editor.lineNumber);
                autoWrapToggle.current?.setStatus(config.editor.autoWrap);
                highlightActiveLineToggle.current?.setStatus(config.editor.highlightActiveLine);
                (Utils.getElem("settings-font-size") as HTMLSelectElement).value = config.editor.fontSize.toString();
                
                getInputElem("settings-ip").value = config.terminal.ip;
                getInputElem("settings-port").value = config.terminal.port.toString();
                getInputElem("settings-username").value = config.terminal.username;
                getInputElem("settings-password").value = config.terminal.password;
            }
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
            <Form>
                <SettingsSection title="文件管理器">
                    <Option name="根目录" description="Linux和Mac应为'/'">
                        <Form.Control type="text" id="settings-root" defaultValue={config.explorer.root}/>
                    </Option>
                </SettingsSection>
                <SettingsSection title="编辑器">
                    <Option name="显示行数">
                        <Toggle ref={lineNumberToggle} id="settings-line-number" defaultValue={config.editor.lineNumber}/>
                    </Option>
                    <Option name="自动换行">
                        <Toggle ref={autoWrapToggle} id="settings-auto-wrap" defaultValue={config.editor.autoWrap}/>
                    </Option>
                    <Option name="活动行高亮">
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
                <SettingsSection title="终端配置">
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

                <Button onClick={() => handleSave()}>保存 (S)</Button>
            </Form>
        </div>
    );
}

export default Settings;
