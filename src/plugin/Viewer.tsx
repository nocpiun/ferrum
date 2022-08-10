import { Component, Context, ReactElement } from "react";
import { Button } from "react-bootstrap";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

import MainContext from "../client/contexts/MainContext";

import Utils from "../Utils";
import PluginLoader from "./PluginLoader";
import {
    ViewerProps,
    ViewerState,
    GetDataUrlResponse,
    MainContextType
} from "../client/types";
// import * as config from "../../config.json";
import { apiUrl } from "../client/global";

export default class Viewer extends Component<ViewerProps, ViewerState> {
    public static contextType?: Context<MainContextType> | undefined = MainContext;
    private static root: string;

    private path: string;
    protected showMsgbox: typeof toast = toast;
    
    public constructor(props: ViewerProps, context: MainContextType) {
        super(props);

        Viewer.root = context.config.explorer.root;

        this.state = {
            viewerComponent: null
        };

        this.path = Viewer.root + this.props.path.replaceAll("\\", "/");
    }

    private fetchData(): void {
        Axios.get(apiUrl +"/getDataUrl?path="+ this.path.replaceAll("/", "\\"))
            .then((res: GetDataUrlResponse) => {
                if(res.data.err == 404) {
                    toast.error(Utils.$("toast.msg10"));
                    return;
                }

                this.setState({
                    viewerComponent: this.props.viewerMetadata.render(res.data.bdata, res.data.type)
                });
            })
            .catch((err) => {throw err});
    }

    public render(): ReactElement {
        const $i18n = PluginLoader.$i18n;

        return (
            <div className={this.props.viewerMetadata.id +" viewer"}>
                <div className="main-container">
                    <div className="toast-container">
                        <Toaster/>
                    </div>
                    <header className="header-container">
                        <h1>{$i18n(this.props.viewerMetadata.pageTitle)}</h1>
                        <p>{Utils.$("global.path")}: {decodeURI(this.props.path)}</p>
                        
                        {this.props.viewerMetadata.headerButtons?.map((item, i) => {
                            return (
                                <Button
                                    className="header-control-button"
                                    onClick={() => item.action()}
                                    key={i}>
                                    {`${$i18n(item.text)} (${item.shortcut.toUpperCase()})`}
                                </Button>
                            );
                        })}
                    </header>
                    <div className="viewer-container">{this.state.viewerComponent}</div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        this.fetchData();
        
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            const buttons = this.props.viewerMetadata.headerButtons;
            if(!buttons) return;

            if(e.ctrlKey) {
                for(let i = 0; i < buttons.length; i++) {
                    if(e.key == buttons[i].shortcut) {
                        e.preventDefault();

                        buttons[i].action();
                    }
                }
            }
        });
    }
}
