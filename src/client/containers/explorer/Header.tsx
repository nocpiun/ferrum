import React, {
    useContext,
    useRef,
    useEffect
} from "react";
import { Form } from "react-bootstrap";

import MainContext from "../../contexts/MainContext";
import Settings from "../settings/Settings";
import Search from "../search/Search";

import DialogBox from "../../components/DialogBox";
import { ExplorerHeaderProps } from "../../types";
import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
// import * as config from "../../../config.json";

const Header: React.FC<ExplorerHeaderProps> = (props) => {
    const { isDemo } = useContext(MainContext);
    const settingsDialogBox = useRef<DialogBox | null>(null);
    const searchDialogBox = useRef<DialogBox | null>(null);

    useEffect(() => {
        Emitter.get().on("dialogClose", (dialogId: string) => {
            if(dialogId === "password-setting") {
                (Utils.getElem("old-password") as HTMLInputElement).value
                    = (Utils.getElem("new-password") as HTMLInputElement).value
                    = "";
            }
        });
    }, []);

    return (
        <header className="header-container">
            <h1>Ferrum 文件管理器 {isDemo ? "(Demo)": ""}</h1>
            <nav id="navbar">
                <button
                    className="header-button back-button"
                    id="back-to-parent"
                    title="返回上级目录"
                    onClick={() => props.onBack()}></button>
                
                <Form.Control 
                    type="text"
                    className="path-input"
                    defaultValue={props.path}
                    placeholder="文件夹路径..."
                    onKeyDown={(e) => props.onEnter(e)}/>
                
                <button
                    className="header-button settings-button"
                    id="settings"
                    title="设置"
                    onClick={() => {
                        if(settingsDialogBox.current) settingsDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button search-button"
                    id="search"
                    title="搜索"
                    onClick={() => {
                        if(searchDialogBox.current) searchDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button star-button"
                    id="star"
                    title="收藏"
                    onClick={() => props.onStar()}></button>
            </nav>

            {DialogBox.createDialog("settings",
                <DialogBox ref={settingsDialogBox} id="settings" title="设置">
                    <Settings />
                </DialogBox>
            )}
            
            {DialogBox.createDialog("search",
                <DialogBox ref={searchDialogBox} id="search" title="搜索">
                    <Search />
                </DialogBox>
            )}
        </header>
    );
}

export default Header;
