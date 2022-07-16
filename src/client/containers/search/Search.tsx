import React, {
    useState,
    useContext,
    useRef
} from "react";
import { Form, ListGroup } from "react-bootstrap";

import ListItem from "../../components/ListItem";
import DirectoryInfoContext from "../../contexts/DirectoryInfoContext";

import { ItemType, DirectoryItem } from "../../types";

const Search: React.FC = () => {
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
        <div className="search-dialog">
            <div className="search-input">
                <Form.Control
                    ref={searchInput}
                    type="text"
                    placeholder="搜索文件夹 / 文件"
                    autoComplete="off"
                    onChange={() => handleInputChange()}/>
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
                                onSelect={(item) => {}}
                                onUnselect={(item) => {}}
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
