import { Component, ReactElement } from "react";

import AlertBox from "../../components/AlertBox";
import { RightSidebarState } from "../../types";
import Emitter from "../../emitter";

export default class RightSidebar<P, S> extends Component<{}, RightSidebarState> {
    public constructor(props: P) {
        super(props);

        this.state = {
            alertBox1: false,
            alertBox2: false,
            alertBox3: false,
            alertBox4: true
        };
    }

    public render(): ReactElement {
        return (
            <div className="sidebar-right-container">
                <AlertBox
                    variant="danger"
                    heading="Error"
                    style={{display: this.state.alertBox1 ? "block" : "none"}}
                    alertId={1}>You are in the root directory.</AlertBox>
                <AlertBox
                    variant="danger"
                    heading="Error"
                    style={{display: this.state.alertBox2 ? "block" : "none"}}
                    alertId={2}>Cannot find the specified directory. Please check your input!</AlertBox>
                <AlertBox
                    variant="success"
                    heading="Info"
                    style={{display: this.state.alertBox3 ? "block" : "none"}}
                    alertId={3}>Deleted.</AlertBox>
                <AlertBox
                    variant="primary"
                    heading="About"
                    style={{display: this.state.alertBox4 ? "block" : "none"}}
                    alertId={4}
                >
                    <b>Ferrum Explorer</b> is a web-based file explorer which is written in React + Typescript by NriotHrreion
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
                case 3:
                    this.setState({alertBox3: true});
                    break;
                case 4:
                    this.setState({alertBox4: true});
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
                    window.history.go(-1);
                    break;
                case 3:
                    this.setState({alertBox3: false});
                    window.location.reload();
                    break;
                case 4:
                    this.setState({alertBox4: false});
                    break;
            }
        });
    }
}
