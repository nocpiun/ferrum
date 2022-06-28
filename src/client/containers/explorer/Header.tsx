import { Component, ReactElement } from "react";
import { Button, Form } from "react-bootstrap";
import Axios from "axios";
import md5 from "md5-node";
import toast from "react-hot-toast";

import DialogBox from "../../components/DialogBox";
import { apiUrl } from "../../global";
import { ExplorerHeaderProps } from "../../types";
import Utils from "../../../Utils";
import * as config from "../../../config.json";

export default class Header extends Component<ExplorerHeaderProps> {
    private passwordDialogBox: DialogBox | null = null;

    public constructor(props: ExplorerHeaderProps) {
        super(props);
    }

    private handleSetPassword(): void {
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
    }

    public render(): ReactElement {
        return (
            <div className="header-container">
                <h1>Ferrum 文件管理器</h1>
                <nav>
                    <Form.Control 
                        type="text"
                        className="path-input"
                        defaultValue={this.props.path}
                        placeholder="文件夹路径..."
                        onKeyDown={(e) => this.props.onEnter(e)}/>
                    <button
                        className="header-button set-password"
                        id="set-password"
                        title="设置密码"
                        onClick={() => {
                            // this.props.onSetPassword();
                            if(this.passwordDialogBox) this.passwordDialogBox.setOpen(true);
                        }}></button>
                    <button
                        className="header-button star"
                        id="star"
                        title="收藏"
                        onClick={() => this.props.onStar()}></button>
                </nav>
                <DialogBox ref={(r) => this.passwordDialogBox = r} title="设置密码">
                    <Form>
                        <Form.Label>旧密码</Form.Label>
                        <Form.Control type="password" id="old-password" autoComplete="off"/>
                        <br/>
                        <Form.Label>新密码</Form.Label>
                        <Form.Control type="password" id="new-password" autoComplete="new-password"/>
                        <br/>
                        <Button onClick={() => this.handleSetPassword()}>提交</Button>
                    </Form>
                </DialogBox>
            </div>
        );
    }
}
