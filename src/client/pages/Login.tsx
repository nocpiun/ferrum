import { Component, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button, Form } from "react-bootstrap";

import * as config from "../../config.json";
import md5 from "md5-node";
import Utils from "../../Utils";

const cookieKey = "fepw";

export default class Login extends Component {
    private passwordInput: HTMLInputElement | null = null;

    private async handleLogin(): Promise<void> {
        if(!this.passwordInput) return;
        if(this.passwordInput.value === "") return;

        var password = this.passwordInput.value;

        if(md5(password) === config.explorer.password) {
            Utils.setCookie(cookieKey, md5(md5(password)));

            toast.success("登录成功");
            await Utils.sleep(500);
            window.location.reload();
        } else {
            toast.error("密码错误");
        }
    }

    public render(): ReactElement {
        return (
            <div className="login-panel">
                <div className="toast-container">
                    <Toaster position="bottom-right"/>
                </div>
                <div className="main-container">
                    <div className="header-container">
                        <img className="icon" src="/icon.png" alt="icon"/>
                        <h1 className="title">Ferrum 登录</h1>
                    </div>
                    <div className="input-container">
                        <Form.Control
                            type="password"
                            placeholder="输入密码"
                            ref={(r: HTMLInputElement | null) => this.passwordInput = r}/>
                        <Button onClick={() => this.handleLogin()}>登录</Button>
                    </div>
                </div>
                <div className="footer-container">
                    <p>Ferrum Explorer - <a href="https://github.com/NriotHrreion/ferrum" target="_blank" rel="noreferrer">Github Repo</a></p>
                    <p className="copy-info">Copyright (c) NriotHrreion {new Date().getFullYear()}</p>
                </div>
            </div>
        );
    }
}
