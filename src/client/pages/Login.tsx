import { Component, Context, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button, Form } from "react-bootstrap";

import MainContext from "../contexts/MainContext";

import Utils from "../../Utils";
import { LoginPanelProps, LoginPanelState, MainContextType } from "../types";
// import * as config from "../../config.json";
import md5 from "md5-node";

const cookieKey = "fepw";

export default class Login extends Component<LoginPanelProps, LoginPanelState> {
    public static contextType?: Context<MainContextType> | undefined = MainContext;

    private passwordInput: HTMLInputElement | null = null;

    public constructor(props: LoginPanelProps) {
        super(props);

        this.state = {
            isEnterDisabled: true
        };
    }

    private async handleLogin(): Promise<void> {
        if(!this.passwordInput) return;
        if(this.passwordInput.value.length == 0) return;

        var password = this.passwordInput.value;

        if(md5(password) === this.context.config.explorer.password) {
            Utils.setCookie(cookieKey, md5(md5(password))); // The value that store into cookie has been double-md5ed

            toast.success(Utils.$("toast.msg12"));
            await Utils.sleep(500);
            window.location.reload();
        } else {
            toast.error(Utils.$("toast.msg13"));
        }
    }

    private handleInputChange(): void {
        if(!this.passwordInput) return;

        this.setState({
            isEnterDisabled: this.passwordInput.value.length == 0
        });
    }

    public render(): ReactElement {
        return (
            <div className="login-panel">
                <div className="toast-container">
                    <Toaster position="bottom-right"/>
                </div>
                <div className="main-container">
                    <div className="header-container">
                        <img className="icon" src="/logo.png" alt="icon" title="Ferrum Explorer"/>
                        <h1 className="title">{Utils.$("page.login.title")}</h1>
                    </div>
                    <div className="input-container">
                        <Form>
                            <Form.Control
                                type="password"
                                placeholder={Utils.$("page.login.password.placeholder")}
                                autoComplete="off"
                                onChange={() => this.handleInputChange()}
                                ref={(r: HTMLInputElement | null) => this.passwordInput = r}/>
                            <Button
                                onClick={() => this.handleLogin()}
                                disabled={this.state.isEnterDisabled}>{Utils.$("page.login.login")}</Button>
                        </Form>
                    </div>
                </div>
                <div className="footer-container">
                    <p>
                        Ferrum Explorer - <a href="https://github.com/nocpiun/ferrum" target="_blank" rel="noreferrer">Github Repo</a>
                        <object data="https://img.shields.io/github/stars/nocpiun/ferrum.svg?style=social&label=Star" aria-label="Github Stars"></object>
                    </p>
                    <p className="copy-info">Copyright (c) NriotHrreion {new Date().getFullYear()}</p>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.key == "Enter") {
                this.handleLogin();
            }
        });
    }
}
