import React, { useContext, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import Axios from "axios";
import md5 from "md5-node";
import toast from "react-hot-toast";

import MainContext from "../../contexts/MainContext";
import Settings from "../settings/Settings";

import DialogBox from "../../components/DialogBox";
import { apiUrl } from "../../global";
import { ExplorerHeaderProps } from "../../types";
import Utils from "../../../Utils";
// import * as config from "../../../config.json";

const Header: React.FC<ExplorerHeaderProps> = (props) => {
    const { isDemo, config } = useContext(MainContext);
    const settingsDialogBox = useRef<DialogBox | null>(null);
    const passwordDialogBox = useRef<DialogBox | null>(null);

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

    return (
        <div className="header-container">
            <h1>Ferrum 文件管理器 {isDemo ? "(Demo)": ""}</h1>
            <nav>
                <Form.Control 
                    type="text"
                    className="path-input"
                    defaultValue={props.path}
                    placeholder="文件夹路径..."
                    onKeyDown={(e) => props.onEnter(e)}/>
                <button
                    className="header-button settings"
                    id="settings"
                    title="设置"
                    onClick={() => {
                        if(settingsDialogBox.current) settingsDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button set-password"
                    id="set-password"
                    title="设置密码"
                    onClick={() => {
                        if(passwordDialogBox.current) passwordDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button star"
                    id="star"
                    title="收藏"
                    onClick={() => props.onStar()}></button>
            </nav>

            {DialogBox.createDialog("settings",
                <DialogBox ref={settingsDialogBox} title="设置 (ctrl+s 保存)">
                    <Settings />
                </DialogBox>
            )}
            
            {DialogBox.createDialog("password-setting",
                <DialogBox ref={passwordDialogBox} title="设置密码">
                    <Form>
                        <Form.Label>旧密码</Form.Label>
                        <Form.Control type="password" id="old-password" autoComplete="off"/>
                        <br/>
                        <Form.Label>新密码</Form.Label>
                        <Form.Control type="password" id="new-password" autoComplete="new-password"/>
                        <br/>
                        <Button onClick={() => handleSetPassword()}>提交</Button>
                    </Form>
                </DialogBox>
            )}
        </div>
    );
}

export default Header;
