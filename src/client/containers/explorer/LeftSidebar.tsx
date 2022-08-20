import React, {
    useState,
    useContext,
    useRef,
    useEffect
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
    const [width, setWidth] = useState(320);
    const searchInput = useRef<HTMLInputElement | null>(null);
    const lsidebar = useRef<HTMLDivElement | null>(null);
    const sash = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        if(!sash.current || !lsidebar.current) return;
        const sashElem = sash.current;
        const asideElem = lsidebar.current;

        const minW = 270;
        const maxW = 700;

        var isHovered = false;
        var isResizing = false;

        // The moving direction of the mouse
        enum Dir {
            LEFT = 0, RIGHT = 1
        }

        // Sash style
        // When the mouse enter the sash div, after half a second, the sash will turn into blue
        sashElem.addEventListener("mouseover", async () => {
            isHovered = true;

            await Utils.sleep(500);
            if(isHovered) sashElem.classList.add("hover");
        });
        sashElem.addEventListener("mouseleave", () => {
            isHovered = false;
            if(isResizing) return;
            sashElem.classList.remove("hover");
        });

        /** @see https://blog.csdn.net/fandyvon/article/details/88718914 */
        asideElem.addEventListener("mousedown", (eOrigin: MouseEvent) => {
            if(!asideElem || !isHovered) return;

            isResizing = true
            
            const oW = asideElem.offsetWidth;
            const oX = eOrigin.clientX;

            var direction: Dir;

            // If the mouse exceeds the right side of the sidebar 10px,
            // then the moving direction is right, and vice versa.
            if(oX > oW - 10) {
                direction = Dir.RIGHT;
            } else if(oX < oW + 10) {
                direction = Dir.LEFT;
            }

            document.body.addEventListener("mousemove", (eMove: MouseEvent) => {
                if(!isResizing) return;
                var curW;

                switch(direction) {
                    case Dir.LEFT:
                        curW = oW - (eMove.clientX - oX);
                        break;
                    case Dir.RIGHT:
                        curW = oW + (eMove.clientX - oX);
                        break;
                }

                setWidth(Math.max(minW, Math.min(maxW, curW))); // minW <= curW <= maxW
            });

            document.body.addEventListener("mouseup", () => {
                if(!isResizing) return;

                isResizing = false;
                if(!isHovered) sashElem.classList.remove("hover");

                asideElem.style.transition = "width .3s"; // Turn on the transition when resizing finished
            });
        });
    }, []);

    useEffect(() => {
        if(!lsidebar.current) return;
        const asideElem = lsidebar.current;

        asideElem.style.transition = "none"; // Turn off the transition when resizing
    }, [width]);

    return (
        <aside className="sidebar-left-container" id="lsidebar" style={{ width: width +"px" }} ref={lsidebar}>
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

            <div className="sash" style={{ left: width +"px" }} ref={sash}></div>
        </aside>
    );
}

export default LeftSidebar;
