import React, { useEffect } from "react";

import { PluginMetadata } from "../src/client/types";

const SVGPage: React.FC<{ dataUrl: string }> = (props) => {
    useEffect(() => {
        document.body.addEventListener("transformAction", () => {
            window.location.href = window.location.href.replace("svg-viewer", "edit");
        });
    }, []);

    return <embed src={props.dataUrl} type="image/svg+xml"/>;
};

export const SVGViewerPlugin: PluginMetadata = {
    name: "svg-viewer",
    displayName: "SVG查看器",
    description: "打开与查看SVG文件",
    setup({ addViewer }) {
        addViewer({
            id: "svg-viewer",
            pageTitle: "Ferrum SVG查看器",
            route: "/svg-viewer",
            formats: ["svg"],
            render: (dataUrl: string) => {
                return <SVGPage dataUrl={dataUrl}/>
            },
            headerButtons: [
                {
                    text: "切换",
                    shortcut: "q",
                    action() {
                        document.body.dispatchEvent(new Event("transformAction"));
                    }
                }
            ]
        });
    },
    native: true
};