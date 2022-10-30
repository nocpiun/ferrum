import React, {
    useState,
    useContext,
    useEffect,
    useRef
} from "react";
import { ListGroup, Form } from "react-bootstrap";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Axios from "axios";

import MainContext from "../contexts/MainContext";
import DirectoryInfoContext from "../contexts/DirectoryInfoContext";

import Utils from "../../Utils";
import { DirectoryItem, ListItemProps, ItemType } from "../types";
import { apiUrl } from "../global";
import Emitter from "../utils/emitter";

const ListItem: React.FC<ListItemProps> = (props) => {
    var itemFormat: string = props.itemType == ItemType.FILE
        ? props.itemName.split(".")[props.itemName.split(".").length - 1] +" "+ Utils.$("page.explorer.list.file")
        : Utils.$("page.explorer.list.folder");
    var itemSize: string = props.itemSize > -1
        ? Utils.formatFloat(props.itemSize / 1024, 1) +"KB"
        : "";
    var renameBoxCurrentValue: string | null = null;

    // To compute the click time in order to detect the user's action (open rename textarea)
    var clickTimer: NodeJS.Timeout | null = null;
    
    const [isRenaming, setIsRenaming] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false); // Not equal to the selection of checkbox
    const { isDemo } = useContext(MainContext);
    const { isZipFile } = useContext(DirectoryInfoContext);
    const renameBox = useRef<HTMLInputElement | null>(null);

    const renameBoxSwitch = () => {
        if(props.disabled) return;
        if(!renameBox.current) return;
        if(props.itemDisplayName) return; // In search dialog

        if(!isRenaming) {
            renameBox.current.focus();
            renameBoxCurrentValue = renameBox.current.value;
            setIsRenaming(true);
        } else {
            renameBoxCurrentValue = null;
            setIsRenaming(false);
        }
    };

    const renameFile = () => {
        if(isDemo || props.disabled) return;
        if(!renameBox.current) return;
        
        Axios.post(apiUrl +"/renameFile", {
            path: (props.itemPath +"/"+ props.itemName).replaceAll("/", "\\"),
            newName: renameBox.current.value
        }).then(() => {
            renameBoxSwitch();
            Emitter.get().emit("fileListUpdate");
        });
    };

    const handleClick = (e: React.MouseEvent) => {
        if((e.target as HTMLElement).className == "form-check-input") return;

        if(isSelected && !isRenaming) {
            renameBoxSwitch();
            return;
        }
        setIsSelected(true);
    };

    const handleSelect = (e: React.ChangeEvent) => {
        var checkbox = e.target as HTMLInputElement;
        var item = JSON.parse(props.itemInfo) as DirectoryItem;

        if(checkbox.checked) { // select
            props.onSelect(item);
        } else { // unselect
            props.onUnselect(item);
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if(props.disabled) return;

        var item = JSON.parse(props.itemInfo) as DirectoryItem;
        var checkbox = Utils.getElem(props.itemName +"--checkbox") as HTMLInputElement;

        if(checkbox.checked != selected) checkbox.checked = selected;
        
        if(selected) {
            props.onSelect(item);
        } else {
            props.onUnselect(item);
        }
    };

    const handleBlur = () => {
        setIsSelected(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.dataTransfer?.setData("oldPath", props.itemPath);
        e.dataTransfer?.setData("name", props.itemName);
    };

    const handleDrop = (e: React.DragEvent) => {
        if(!e.dataTransfer) return;

        const name = e.dataTransfer.getData("name");
        var origin = e.dataTransfer.getData("oldPath") +"/"+ name,
            target = props.itemPath +"/"+ props.itemName +"/"+ name;
        if(props.itemType == ItemType.FILE) {
            target = props.itemPath +"/"+ name;
        }

        e.dataTransfer.clearData("oldPath");
        e.dataTransfer.clearData("name");

        if(origin == props.itemPath +"/"+ props.itemName) return false;

        Axios.post(apiUrl +"/move", {
            oldPath: origin,
            newPath: target
        }).then(() => Emitter.get().emit("fileListUpdate"));

        e.preventDefault();
    };

    useEffect(() => {
        document.body.addEventListener("click", (e: MouseEvent) => {
            var elem = e.target as HTMLElement;
            if(
                elem.id != props.itemName +"--renamebox" &&
                elem.id != props.itemName +"--listitem" &&
                isRenaming &&
                !props.disabled
            ) {
                if(renameBoxCurrentValue != props.itemName) renameFile();
                renameBoxSwitch();
            }
        });

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key == "a") {
                e.preventDefault();
                handleSelectAll(true);
            } else if(e.key == "Escape") {
                e.preventDefault();
                handleSelectAll(false);
            }
        });

        // Emitter.get().on("selectAll", (selected: boolean) => handleSelectAll(selected));
    });

    interface MenuItemData {
        info: string
    }

    return (
        <ListGroup.Item
            action
            className="list-item"
            id={props.itemName +"--listitem"}
            onClick={(e: React.MouseEvent) => {
                if(clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    handleClick(e); // Rename
                }, 250);
            }}
            onDoubleClick={(e: React.MouseEvent) => {
                if((e.target as HTMLElement).className == "form-check-input") return;
                if(isRenaming || props.disabled) return;
                if(clickTimer) clearTimeout(clickTimer);
                if(props.itemType == ItemType.FOLDER) window.location.href += "/"+ props.itemName;
            }}
            onBlur={() => handleBlur()}
            onDragStart={(e: React.DragEvent) => handleDrag(e)}
            onDragOver={(e: React.DragEvent) => e.preventDefault() /* To allow drop */}
            onDrop={(e: React.DragEvent) => handleDrop(e)}
            data-info={props.itemInfo}
            data-type={props.itemType}
            draggable={!(isDemo || isZipFile || isRenaming)}>
            <ContextMenuTrigger id={props.itemName +"--rcmenu"}>
                <Form.Check
                    className="list-item-checkbox"
                    id={props.itemName +"--checkbox"}
                    onChange={(e: React.ChangeEvent) => handleSelect(e)}
                    disabled={props.disabled ?? false}/>
                <span
                    className="list-item-name"
                    style={{display: isRenaming ? "none" : "inline-block"}}>
                        {props.itemDisplayName ?? props.itemName}
                </span>
                <span className="list-item-format">{itemFormat}</span>
                <span className="list-item-size">{itemSize}</span>

                <Form.Control
                    className="list-item-rename"
                    type={isRenaming ? "text" : "hidden"}
                    defaultValue={props.itemName as string}
                    onKeyDown={(e) => {
                        if(e.key == "Enter") renameFile();
                    }}
                    onChange={() => {
                        if(renameBox.current) renameBoxCurrentValue = renameBox.current.value;
                    }}
                    id={props.itemName +"--renamebox"}
                    ref={renameBox}/>
            </ContextMenuTrigger>

            <ContextMenu id={props.itemName +"--rcmenu"}>
                <MenuItem
                    className="common"
                    data={{ info: props.itemInfo } as MenuItemData}
                    onClick={(e, data: MenuItemData) => {
                        Emitter.get().emit("openProperties", JSON.parse(data.info) as DirectoryItem);
                    }}>{Utils.$("page.explorer.list.properties")}</MenuItem>
            </ContextMenu>
        </ListGroup.Item>
    );
}

export default ListItem;
