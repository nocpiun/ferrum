import { Component, Context, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

import MainContext from "../client/contexts/MainContext";

import Utils from "../Utils";
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
                    viewerComponent: this.props.viewerMetadata.render(res.data.bdata)
                });
            })
            .catch((err) => {throw err});
    }

    public render(): ReactElement {
        return (
            <div className={this.props.viewerMetadata.id +" viewer"}>
                <div className="main-container">
                    <div className="toast-container">
                        <Toaster/>
                    </div>
                    <header className="header-container">
                        <h1>{this.props.viewerMetadata.pageTitle}</h1>
                        <p>{Utils.$("global.path")}: {decodeURI(this.props.path)}</p>
                    </header>
                    <div className="viewer-container">{this.state.viewerComponent}</div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        this.fetchData();
    }
}
