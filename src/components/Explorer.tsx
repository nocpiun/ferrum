import { Component, ReactElement } from "react";
import { Button } from "react-bootstrap";

export default class Explorer extends Component<ExplorerProps, {}> {    
    public render(): ReactElement {
        return (
            <div>
                <h1>Explorer</h1>
                <Button/>
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Ferrum - "+ this.props.path;
    }
}

interface ExplorerProps {
    path: string
}
