import React, {
    useContext,
    useRef,
    useEffect
} from "react";
import { Form } from "react-bootstrap";
import Axios from "axios";

import MainContext from "../../contexts/MainContext";
import DirectoryInfoContext from "../../contexts/DirectoryInfoContext";
import Settings from "../settings/Settings";
import Search from "../search/Search";

import DialogBox from "../../components/DialogBox";
import { ExplorerHeaderProps } from "../../types";
import { apiUrl } from "../../global";
import Utils from "../../../Utils";
import Emitter from "../../utils/emitter";
// import * as config from "../../../config.json";

const Header: React.FC<ExplorerHeaderProps> = (props) => {
    const { isDemo } = useContext(MainContext);
    const { path } = useContext(DirectoryInfoContext);

    const settingsDialogBox = useRef<DialogBox | null>(null);
    const searchDialogBox = useRef<DialogBox | null>(null);

    const handleDrop = (e: React.DragEvent) => {
        if(!e.dataTransfer) return;

        const name = e.dataTransfer.getData("name");
        const origin = e.dataTransfer.getData("oldPath") +"/"+ name,
            target = path +"/../"+ name;
        e.dataTransfer.clearData("oldPath");
        e.dataTransfer.clearData("name");

        Axios.post(apiUrl +"/move", {
            oldPath: origin,
            newPath: target
        }).then(() => Emitter.get().emit("fileListUpdate"));

        e.preventDefault();
    };

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
                    onClick={() => props.onBack()}
                    onDragOver={(e: React.DragEvent) => e.preventDefault()}
                    onDrop={(e: React.DragEvent) => handleDrop(e) /* To allow drop */}/>
                
                <Form.Control 
                    type="text"
                    className="path-input"
                    defaultValue={props.path}
                    placeholder={Utils.$("page.explorer.nav.path.placeholder")}
                    onKeyDown={(e) => props.onEnter(e)}/>
                
                <button
                    className="header-button newpage-button"
                    id="settings"
                    title={"newpage"}
                    onClick={() => {
                        window.open(window.location.href, "newwindow", "width=1200,height=700");
                    }}/>
                <button
                    className="header-button settings-button"
                    id="settings"
                    title={Utils.$("page.explorer.nav.settings")}
                    onClick={() => {
                        if(settingsDialogBox.current) settingsDialogBox.current.setOpen(true);
                    }}/>
                <button
                    className="header-button search-button"
                    id="search"
                    title={Utils.$("page.explorer.nav.search")}
                    onClick={() => {
                        if(searchDialogBox.current) searchDialogBox.current.setOpen(true);
                    }}/>
                <button
                    className="header-button star-button"
                    id="star"
                    title={Utils.$("page.explorer.nav.star")}
                    onClick={() => props.onStar()}/>
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
