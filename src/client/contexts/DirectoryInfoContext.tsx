import React from "react"

import { DirectoryInfoContextType } from "../types";

const DirectoryInfoContext = React.createContext<DirectoryInfoContextType>({
    path: "",
    directoryItems: []
});
DirectoryInfoContext.displayName = "DirItemContext";

export default DirectoryInfoContext;
