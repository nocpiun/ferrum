import { Component, ReactElement } from "react";
import { Button } from "react-bootstrap";

import { DialogBoxProps, DialogBoxState } from "../types";

export default class DialogBox extends Component<DialogBoxProps, DialogBoxState> {
    public constructor(props: DialogBoxProps) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    public setOpen(isOpen: boolean): void {
        this.setState({ isOpen });
    }

    public render(): ReactElement {
        return (
            <>
                <div className="dialog-backdrop" style={{display: this.state.isOpen ? "block" : "none"}}></div>
                <dialog className="dialog-container" style={{display: this.state.isOpen ? "flex" : "none"}}>
                    <div className="dialog-header">
                        <h2>{this.props.title}</h2>
                    </div>
                    <div className="dialog-content">{this.props.children}</div>
                    <div className="dialog-footer">
                        <Button id="dialog-close" onClick={() => this.setOpen(false)}>关闭</Button>
                    </div>
                </dialog>
            </>
        );
    }

    public componentDidMount(): void {
        // Disable the mouse wheel when the dialog is open
        document.addEventListener("DOMMouseScroll", () => {return false}, {passive: false}); // Firefox
        window.addEventListener("mousewheel", (e: Event) => {
            if(this.state.isOpen) {
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }, {passive: false});
    }
}
