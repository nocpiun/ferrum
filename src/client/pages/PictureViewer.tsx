import { Component, Context, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

import MainContext from "../contexts/MainContext";

// containers
import Header from "../containers/pictureViewer/Header";

// icons
import transparentImage from "../../icons/transparent.png";

import {
    PictureViewerProps,
    PictureViewerState,
    GetDataUrlResponse,
    MainContextType
} from "../types";
import { apiUrl } from "../global";
// import * as config from "../../config.json";

export default class PictureViewer extends Component<PictureViewerProps, PictureViewerState> {
    public static contextType?: Context<MainContextType> | undefined = MainContext;
    private static root: string;

    private path: string;
    
    public constructor(props: PictureViewerProps, context: MainContextType) {
        super(props);

        PictureViewer.root = context.config.explorer.root;

        this.state = {
            pictureData: transparentImage
        };
        this.path = PictureViewer.root + this.props.path.replaceAll("\\", "/");
    }

    public render(): ReactElement {
        return (
            <div className="picture-viewer viewer">
                <div className="main-container">
                    <div className="toast-container">
                        <Toaster/>
                    </div>
                    <Header path={decodeURI(this.path)}/>
                    <div className="viewer-container">
                        <img src={this.state.pictureData} alt={this.path}/>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        Axios.get(apiUrl +"/getDataUrl?path="+ this.path.replaceAll("/", "\\"))
            .then((res: GetDataUrlResponse) => {
                if(res.data.err == 404) {
                    toast.error("无法找到指定图片");
                    return;
                }

                this.setState({
                    pictureData: res.data.bdata
                });
            })
            .catch((err) => {throw err});
    }
}
