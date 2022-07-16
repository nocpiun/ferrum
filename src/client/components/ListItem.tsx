import React, {
    useState,
    useContext,
    useEffect,
    useRef
} from "react";
import { ListGroup, Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import Axios from "axios";

import MainContext from "../contexts/MainContext";

import Utils from "../../Utils";
import { DirectoryItem, ListItemProps, ItemType } from "../types";
import { apiUrl } from "../global";
import Emitter from "../utils/emitter";

const ListItem: React.FC<ListItemProps> = (props) => {
    var itemSize: string = props.itemSize > -1
        ? Utils.fomatFloat(props.itemSize / 1024, 1) +"KB"
        : "";
    var renameBoxCurrentValue: string | null = null;

    // To compute the click time in order to detect the user's action (open rename textarea)
    var clickTimer: NodeJS.Timeout | null = null;
    
    const [isRenaming, setIsRenaming] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false); // Not equal to the selection of checkbox
    const { isDemo } = useContext(MainContext);
    const renameBox = useRef<HTMLInputElement>(null);

    const renameBoxSwitch = () => {
        if(!renameBox.current) return;

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
        if(isDemo) return;
        if(!renameBox.current) return;

        toast.promise(Axios.post(apiUrl +"/renameFile", {
            path: (props.itemPath +"/"+ props.itemName).replaceAll("/", "\\"),
            newName: renameBox.current.value
        }), {
            loading: "加载中...",
            success: "重命名成功",
            error: "重命名失败"
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

    const handleSelect = () => {
        var checkbox = Utils.getElem(props.itemName +"--checkbox") as HTMLInputElement;
        var item = JSON.parse(props.itemInfo) as DirectoryItem;

        if(checkbox.checked) { // select
            props.onSelect(item);
        } else { // unselect
            props.onUnselect(item);
        }
    };

    const handleSelectAll = (selected: boolean) => {
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

    useEffect(() => {
        document.body.addEventListener("click", (e: MouseEvent) => {
            var elem = e.target as HTMLElement;
            if(
                elem.id != props.itemName +"--renamebox" &&
                elem.id != props.itemName +"--listitem" &&
                isRenaming
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

    return (
        <ListGroup.Item
            action
            className="list-item"
            id={props.itemName +"--listitem"}
            title="勾选多选框选中 / 双击打开 (文件夹) / 单击后再次单击重命名"
            onClick={(e: React.MouseEvent) => {
                if(clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(() => {
                    handleClick(e); // Rename
                }, 250);
            }}
            onDoubleClick={(e: React.MouseEvent) => {
                if((e.target as HTMLElement).className == "form-check-input") return;
                if(isRenaming) return;
                if(clickTimer) clearTimeout(clickTimer);
                if(props.itemType == ItemType.FOLDER) window.location.href += "/"+ props.itemName;
            }}
            onBlur={() => handleBlur()}
            data-info={props.itemInfo}
            data-type={props.itemType}
        >
            <Form.Check
                className="list-item-checkbox"
                id={props.itemName +"--checkbox"}
                onChange={() => handleSelect()}/>
            <span
                className="list-item-name"
                style={{display: isRenaming ? "none" : "inline-block"}}>{props.itemDisplayName ?? props.itemName}</span>
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
        </ListGroup.Item>
    );
}

export default ListItem;
