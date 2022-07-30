import { Component, Context, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

import MainContext from "../contexts/MainContext";

import {
    ViewerProps,
    ViewerState,
    GetDataUrlResponse,
    MainContextType
} from "../types";
// import * as config from "../../config.json";
import { apiUrl } from "../global";

export default class Viewer extends Component<ViewerProps, ViewerState> {
    public static contextType?: Context<MainContextType> | undefined = MainContext;
    private static root: string;

    private path: string;
    protected option: ViewerOption;
    protected showMsgbox: typeof toast = toast;
    
    public constructor(props: ViewerProps, context: MainContextType) {
        super(props);

        Viewer.root = context.config.explorer.root;

        this.state = {
            viewerComponent: null
        };

        this.option = this.props.viewerMetadata.entry;
        this.path = Viewer.root + this.props.path.replaceAll("\\", "/");
    }

    private fetchData(): void {
        Axios.get(apiUrl +"/getDataUrl?path="+ this.path.replaceAll("/", "\\"))
            .then((res: GetDataUrlResponse) => {
                if(res.data.err == 404) {
                    toast.error("无法找到指定文件");
                    return;
                }

                this.setState({
                    viewerComponent: this.option.render(res.data.bdata)
                });
            })
            .catch((err) => {throw err});
    }

    public render(): ReactElement {
        return (
            <div className={this.props.viewerMetadata.name +" viewer"}>
                <div className="main-container">
                    <div className="toast-container">
                        <Toaster/>
                    </div>
                    <header className="header-container">
                        <h1>{this.props.viewerMetadata.displayName}</h1>
                        <p>路径: {decodeURI(this.props.path)}</p>
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

export interface ViewerOption {
    route: string
    formats: string[]
    render: (dataUrl: string) => ReactElement
}
