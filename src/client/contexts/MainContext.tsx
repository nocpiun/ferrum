import React from "react";
import { MainContextType } from "../types";

// This context is provided with two params for the other components by the top component in `src/index.tsx`
const MainContext = React.createContext<MainContextType>({
    isDemo: false, // let the components know whether the app is running under demo mode
    config: { // let the components know the config so that they can work in the correct way
        "explorer": {
            "root": "C:",
            "password": "e10adc3949ba59abbe56e057f20f883e"
        },
        "editor": {
            "lineNumber": true,
            "autoWrap": false,
            "highlightActiveLine": true,
            "fontSize": 14
        },
        "terminal": {
            "ip": "0.0.0.0",
            "port": 22,
            "username": "root",
            "password": "123456"
        }
    }
});
MainContext.displayName = "MainContext";

export default MainContext;
