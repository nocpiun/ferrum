import React, {
    useState,
    useContext,
    useRef
} from "react";
import { Form, ListGroup, Button } from "react-bootstrap";

import Explorer from "../../pages/Explorer";
import ListItem from "../../components/ListItem";
import DirectoryInfoContext from "../../contexts/DirectoryInfoContext";

import { ItemType, DirectoryItem } from "../../types";

const Search: React.FC = () => {
    const { path, directoryItems } = useContext(DirectoryInfoContext);

    const [result, setResult] = useState<DirectoryItem[]>([]);
    const [selected, setSelected] = useState<DirectoryItem[]>([]);
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

    const handleOpenFile = () => {
        if(selected.length != 1) return;

        Explorer.openFile(path, selected[0]);
    };

    return (
        <div className="search-dialog">
            <div className="search-header">
                <Form.Control
                    ref={searchInput}
                    className="search-input"
                    type="text"
                    placeholder="搜索文件夹 / 文件"
                    autoComplete="off"
                    onChange={() => handleInputChange()}/>
                <Button
                    className="search-open-item"
                    disabled={result.length == 0 || selected.length > 1 || selected.length == 0}
                    onClick={() => handleOpenFile()}>打开</Button>
            </div>
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

                            return <ListItem
                                title="勾选多选框选中 / 双击打开 (文件夹)"
                                itemType={value.isFile ? ItemType.FILE : ItemType.FOLDER}
                                itemName={value.fullName}
                                itemDisplayName={
                                    <>
                                        {str1}<span className="highlight">{str2}</span>{str3}
                                    </>
                                }
                                itemSize={value.size ?? -1}
                                itemInfo={JSON.stringify(value)}
                                itemPath={path}
                                onSelect={(item) => setSelected([...selected, item])}
                                onUnselect={(item) => {
                                    var list = selected.splice(0);
                                    var index = -1;

                                    for(let i = 0; i < list.length; i++) {
                                        if(list[i].fullName == item.fullName) {
                                            index = i;
                                        }
                                    }

                                    if(index > -1) {
                                        list.splice(index, 1);
                            
                                        setSelected(list);
                                    }
                                }}
                                key={index}
                            />;
                        })
                    }
                </ListGroup>
            </div>
        </div>
    );
}

export default Search;
