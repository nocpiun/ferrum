/* eslint-disable eqeqeq */
import React, { Component, ReactElement } from "react";
import { ListGroup, FormControl } from "react-bootstrap";
import { toast } from "react-hot-toast";
import Axios from "axios";

import Utils from "../../Utils";
import Emitter from "../emitter";
import { ListItemProps, ListItemState } from "../types";

const hostname = "http://"+ window.location.hostname;
const apiUrl = hostname +":3301";

export default class ListItem extends Component<ListItemProps, ListItemState> {
    private itemSize: string;
    private renameBoxRef: React.RefObject<HTMLInputElement> = React.createRef();
    private clickTimer: NodeJS.Timeout | null = null;
    
    public constructor(props: ListItemProps) {
        super(props);

        this.state = {
            isRenaming: false,
            isSelected: false
        };

        if(this.props.itemSize > -1) {
            this.itemSize = Utils.fomatFloat(this.props.itemSize / 1024, 1) +"KB";
        } else {
            this.itemSize = "";
        }
    }

    private renameBoxSwitch(): void {
        if(!this.renameBoxRef.current) return;

        if(!this.state.isRenaming) {
            this.renameBoxRef.current.focus();
            this.setState({isRenaming: true});
        } else {
            this.setState({isRenaming: false});
        }
    }

    private renameFile(): void {
        if(!this.renameBoxRef.current) return;

        toast.promise(Axios.post(apiUrl +"/renameFile", {
            path: (this.props.itemPath +"/"+ this.props.itemName).replaceAll("/", "\\"),
            newName: this.renameBoxRef.current.value
        }), {
            loading: "加载中...",
            success: "重命名成功",
            error: "重命名失败"
        }).then(() => {
            this.renameBoxSwitch();
            window.location.reload();
        });
    }

    private handleClick(): void {
        if(this.state.isSelected) {
            this.renameBoxSwitch();
            return;
        }
        this.setState({isSelected: true});
    }

    private handleBlur(): void {
        this.setState({isSelected: false});
    }

    public render(): ReactElement {
        return (
            <ListGroup.Item
                action
                className="list-item"
                title="单击选中 / 双击打开"
                onClick={(e) => {
                    if(this.clickTimer) clearTimeout(this.clickTimer);
                    this.clickTimer = setTimeout(() => {
                        this.props.onClick(e.target as HTMLButtonElement)
                        this.handleClick();
                    }, 250);
                }}
                onDoubleClick={() => {
                    if(this.clickTimer) clearTimeout(this.clickTimer);
                    if(this.props.itemType == "folder") window.location.href += "/"+ this.props.itemName;
                }}
                onBlur={() => this.handleBlur()}
                data-info={this.props.itemInfo}
                data-type={this.props.itemType}
            >
                <span className="list-item-name" onClick={(e) => this.props.onClick((e.target as HTMLElement).parentElement as HTMLButtonElement)}>{this.props.itemName}</span>
                <span className="list-item-size" onClick={(e) => this.props.onClick((e.target as HTMLElement).parentElement as HTMLButtonElement)}>{this.itemSize}</span>
                
                <FormControl
                    className="list-item-rename"
                    type={this.state.isRenaming ? "text" : "hidden"}
                    defaultValue={this.props.itemName}
                    onKeyDown={(e) => {
                        if(e.key == "Enter") this.renameFile();
                    }}
                    ref={this.renameBoxRef}/>
            </ListGroup.Item>
        );
    }

    public componentDidMount(): void {
        Emitter.get().on("openRenameBox", (fullName: string) => {
            if(!this.renameBoxRef.current || this.props.itemName != fullName) return;

            this.renameBoxSwitch();
        });
    }
}
