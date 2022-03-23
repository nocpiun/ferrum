/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

// containers
import Header from "../containers/pictureViewer/Header";

// icons
import transparentImage from "../../icons/transparent.png";

import { PictureViewerProps, PictureViewerState, GetDataUrlResponse } from "../types";
import config from "../../config.json";

const hostname = "http://"+ window.location.hostname;
const apiUrl = hostname +":3301";
const root = config.explorer.root;

export default class PictureViewer extends Component<PictureViewerProps, PictureViewerState> {
    private path: string;
    
    public constructor(props: PictureViewerProps) {
        super(props);

        this.state = {
            pictureData: transparentImage
        };
        this.path = root + this.props.path.replaceAll("\\", "/");
    }

    public render(): ReactElement {
        return (
            <div className="picture-viewer">
                <div className="main-container">
                    <div className="toast-container">
                        <Toaster/>
                    </div>
                    <Header path={this.path}/>
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
                    toast.error("Cannot find the specified picture.");
                    return;
                }

                this.setState({
                    pictureData: res.data.url
                });
            })
            .catch((err) => {throw err});
    }
}
