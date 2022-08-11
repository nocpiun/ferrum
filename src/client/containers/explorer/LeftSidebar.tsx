import React, {
    useState,
    useContext,
    useRef
} from "react";
import { ListGroup, Form } from "react-bootstrap";

import Explorer from "../../pages/Explorer";
import LeftSidebarPanel from "./LeftSidebarPanel";
import DirectoryInfoContext from "../../contexts/DirectoryInfoContext";

import Utils from "../../../Utils";
import {
    ExplorerLeftSidebarProps,
    DirectoryItem
} from "../../types";

const LeftSidebar: React.FC<ExplorerLeftSidebarProps> = (props) => {
    const { path, directoryItems } = useContext(DirectoryInfoContext);

    const [result, setResult] = useState<DirectoryItem[]>([]);
    const searchInput = useRef<HTMLInputElement | null>(null);

    const handleInputChange = () => {
        if(!searchInput.current) return;
        var value = searchInput.current.value;
        var tempResult: DirectoryItem[] = [];

        // Clear all the results if the input value is empty
        if(value.length == 0) {
            setResult([]);
            return;
        }

        // Search items
        for(let i = 0; i < directoryItems.length; i++) {
            var fileName = directoryItems[i].fullName.toLowerCase();
            var searchName = value.toLowerCase();

            if(fileName.indexOf(searchName) > -1) {
                tempResult.push(directoryItems[i]);
            }
        }

        setResult(tempResult);
    };

    return (
        <aside className="sidebar-left-container">
            {/* Star list */}
            <LeftSidebarPanel title={Utils.$("page.explorer.left.title")} id="star-list">
                <ListGroup id="starred-dir-list">{props.starredList ? props.starredList : null}</ListGroup>
            </LeftSidebarPanel>
            {/* Search */}
            <LeftSidebarPanel title={Utils.$("search")} id="search">
                <Form.Control
                    ref={searchInput}
                    className="search-input"
                    type="text"
                    placeholder={Utils.$("search.input.placeholder")}
                    autoComplete="off"
                    onChange={() => handleInputChange()}/>
                <div className="search-result">
                    <ListGroup>
                        {
                            result.map((value, index) => {
                                if(!searchInput.current) return;
                                var fullName = value.fullName.toLowerCase(),
                                    target = searchInput.current.value.toLowerCase();
                                
                                var targetStartIndex = fullName.indexOf(target);
                                var targetEndIndex = targetStartIndex + target.length;

                                var str1 = value.fullName.substring(0, targetStartIndex),
                                    str2 = value.fullName.substring(targetStartIndex, targetEndIndex),
                                    str3 = value.fullName.substring(targetEndIndex, fullName.length);

                                return (
                                    <ListGroup.Item
                                        className={value.isFile ? "file" : "directory"}
                                        action
                                        title={value.fullName}
                                        onClick={() => Explorer.openFile(path, value)}
                                        key={index}>
                                        <span className="list-item-name">
                                            {str1}<span className="highlight">{str2}</span>{str3}
                                        </span>
                                    </ListGroup.Item>
                                );
                            })
                        }
                    </ListGroup>
                </div>
            </LeftSidebarPanel>
        </aside>
    );
}

export default LeftSidebar;
