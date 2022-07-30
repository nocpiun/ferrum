import React, {
    useState,
    useContext,
    useRef,
    useEffect
} from "react";
import { Button, Form } from "react-bootstrap";
import Axios from "axios";
import md5 from "md5-node";
import toast from "react-hot-toast";

import MainContext from "../../contexts/MainContext";
import Settings from "../settings/Settings";
import Search from "../search/Search";

import DialogBox from "../../components/DialogBox";
import { apiUrl } from "../../global";
import { ExplorerHeaderProps } from "../../types";
import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
// import * as config from "../../../config.json";

const Header: React.FC<ExplorerHeaderProps> = (props) => {
    const [validated, setValidated] = useState(false);

    const { isDemo, config } = useContext(MainContext);
    const settingsDialogBox = useRef<DialogBox | null>(null);
    const passwordDialogBox = useRef<DialogBox | null>(null);
    const passwordForm = useRef<HTMLFormElement | null>(null);
    const searchDialogBox = useRef<DialogBox | null>(null);

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

    useEffect(() => {
        Emitter.get().on("dialogClose", (dialogId: string) => {
            if(dialogId === "password-setting") {
                (Utils.getElem("old-password") as HTMLInputElement).value
                    = (Utils.getElem("new-password") as HTMLInputElement).value
                    = "";
            }
        });
    }, []);

    return (
        <header className="header-container">
            <h1>Ferrum 文件管理器 {isDemo ? "(Demo)": ""}</h1>
            <nav id="navbar">
                <button
                    className="header-button back-button"
                    id="back-to-parent"
                    title="返回上级目录"
                    onClick={() => props.onBack()}></button>
                
                <Form.Control 
                    type="text"
                    className="path-input"
                    defaultValue={props.path}
                    placeholder="文件夹路径..."
                    onKeyDown={(e) => props.onEnter(e)}/>
                
                <button
                    className="header-button settings-button"
                    id="settings"
                    title="设置"
                    onClick={() => {
                        if(settingsDialogBox.current) settingsDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button set-password-button"
                    id="set-password"
                    title="设置密码"
                    onClick={() => {
                        if(passwordDialogBox.current) passwordDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button search-button"
                    id="search"
                    title="搜索"
                    onClick={() => {
                        if(searchDialogBox.current) searchDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button star-button"
                    id="star"
                    title="收藏"
                    onClick={() => props.onStar()}></button>
            </nav>

            {DialogBox.createDialog("settings",
                <DialogBox ref={settingsDialogBox} id="settings" title="设置">
                    <Settings />
                </DialogBox>
            )}
            
            {DialogBox.createDialog("password-setting",
                <DialogBox ref={passwordDialogBox} id="password-setting" title="设置密码">
                    <Form ref={passwordForm} noValidate validated={validated}>
                        <Form.Group>
                            <Form.Label>旧密码</Form.Label>
                            <Form.Control type="password" id="old-password" autoComplete="off" required/>
                            <Form.Control.Feedback type="invalid">请输入旧密码</Form.Control.Feedback>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>新密码</Form.Label>
                            <Form.Control type="password" id="new-password" autoComplete="new-password" required/>
                            <Form.Control.Feedback type="invalid">请输入新密码</Form.Control.Feedback>
                        </Form.Group>
                        <br/>
                        <Button onClick={() => {
                            if(passwordForm.current?.checkValidity()) {
                                setValidated(true);
                                handleSetPassword();
                            }
                        }}>提交</Button>
                    </Form>
                </DialogBox>
            )}

            {DialogBox.createDialog("search",
                <DialogBox ref={searchDialogBox} id="search" title="搜索">
                    <Search />
                </DialogBox>
            )}
        </header>
    );
}

export default Header;
