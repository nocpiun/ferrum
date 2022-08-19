import React from "react"

import { DirectoryInfoContextType } from "../types";

const DirectoryInfoContext = React.createContext<DirectoryInfoContextType>({
    path: "",
    directoryItems: [],
    isZipFile: false
});
DirectoryInfoContext.displayName = "DirItemContext";

export default DirectoryInfoContext;
