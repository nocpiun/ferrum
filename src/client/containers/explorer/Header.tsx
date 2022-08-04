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
            <h1>{Utils.$("page.explorer.title")} {isDemo ? "(Demo)": ""}</h1>
            <nav id="navbar">
                <button
                    className="header-button back-button"
                    id="back-to-parent"
                    title={Utils.$("page.explorer.nav.back")}
                    onClick={() => props.onBack()}></button>
                
                <Form.Control 
                    type="text"
                    className="path-input"
                    defaultValue={props.path}
                    placeholder={Utils.$("page.explorer.nav.path.placeholder")}
                    onKeyDown={(e) => props.onEnter(e)}/>
                
                <button
                    className="header-button settings-button"
                    id="settings"
                    title={Utils.$("page.explorer.nav.settings")}
                    onClick={() => {
                        if(settingsDialogBox.current) settingsDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button search-button"
                    id="search"
                    title={Utils.$("page.explorer.nav.search")}
                    onClick={() => {
                        if(searchDialogBox.current) searchDialogBox.current.setOpen(true);
                    }}></button>
                <button
                    className="header-button star-button"
                    id="star"
                    title={Utils.$("page.explorer.nav.star")}
                    onClick={() => props.onStar()}></button>
            </nav>

            {DialogBox.createDialog("settings",
                <DialogBox ref={settingsDialogBox} id="settings" title={Utils.$("settings")}>
                    <Settings />
                </DialogBox>
            )}
            
            {DialogBox.createDialog("search",
                <DialogBox ref={searchDialogBox} id="search" title={Utils.$("search")}>
                    <Search />
                </DialogBox>
            )}
        </header>
    );
}

export default Header;
