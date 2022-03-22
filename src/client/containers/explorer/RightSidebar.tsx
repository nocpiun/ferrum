import { Component, ReactElement } from "react";
import { FilePond } from "react-filepond";

import AlertBox from "../../components/AlertBox";
import { ExplorerRightSidebarProps, ExplorerRightSidebarState } from "../../types";
import Emitter from "../../emitter";

const apiUrl = "http://"+ window.location.hostname +":3301";

export default class RightSidebar extends Component<ExplorerRightSidebarProps, ExplorerRightSidebarState> {
    private pond: FilePond | null = null;
    
    public constructor(props: ExplorerRightSidebarProps) {
        super(props);

        this.state = {
            alertBox1: true,
            alertBox2: false
        };
    }

    private handleFilepondInit(): void {
        console.log("Filepond is ready.", this.pond);
    }

    public render(): ReactElement {
        return (
            <div className="sidebar-right-container">
                <AlertBox
                    variant="primary"
                    heading="About"
                    style={{display: this.state.alertBox1 ? "block" : "none"}}
                    alertId={1}
                >
                    <b>Ferrum Explorer</b> is a web-based file explorer which is written in React + Typescript by NriotHrreion
                </AlertBox>
                <AlertBox
                    variant="success"
                    heading="Upload File"
                    style={{display: this.state.alertBox2 ? "block" : "none"}}
                    alertId={2}
                >
                    <p>Drag or browse to upload file(s)<br/>[up to 5] to the directory</p>
                    <FilePond
                        ref={(ref) => {this.pond = ref}}
                        allowMultiple={true}
                        maxFiles={5}
                        server={apiUrl +"/uploadFile?path="+ this.props.path.replaceAll("/", "\\")}
                        oninit={() => this.handleFilepondInit()}/>
                </AlertBox>
            </div>
        );
    }

    public componentDidMount(): void {
        Emitter.get().on("displayAlert", (id: number) => {
            switch(id) {
                case 1:
                    this.setState({alertBox1: true});
                    break;
                case 2:
                    this.setState({alertBox2: true});
                    break;
            }
        });
        Emitter.get().on("closeAlert", (id: number) => {
            switch(id) {
                case 1:
                    this.setState({alertBox1: false});
                    break;
                case 2:
                    this.setState({alertBox2: false});
                    break;
            }
        });
    }
}
