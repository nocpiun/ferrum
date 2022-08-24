import React, { useEffect } from "react";
import { Image } from "react-bootstrap";

import { PluginMetadata } from "../src/client/types";

const i18n = {
    "zh-CN": {
        "viewer.svg.name": "SVG查看器",
        "viewer.svg.description": "打开与查看SVG文件",
        "viewer.svg.title": "Ferrum SVG查看器",
        "viewer.svg.transform": "转换"
    },
    "zh-TW": {
        "viewer.svg.name": "SVG查看器",
        "viewer.svg.description": "打開與查看SVG文件",
        "viewer.svg.title": "Ferrum SVG查看器",
        "viewer.svg.transform": "轉換"
    },
    "en": {
        "viewer.svg.name": "SVG Viewer",
        "viewer.svg.description": "Open and view a SVG file",
        "viewer.svg.title": "Ferrum SVG Viewer",
        "viewer.svg.transform": "Transform"
    }
};

const SVGPage: React.FC<{ dataUrl: string }> = (props) => {
    useEffect(() => {
        document.body.addEventListener("transformAction", () => {
            window.location.href = window.location.href.replace("svg-viewer", "edit");
        });
    }, []);

    return <Image src={props.dataUrl} fluid/>
};

export const SVGViewerPlugin: PluginMetadata = {
    name: "svg-viewer",
    displayName: "$viewer.svg.name",
    description: "$viewer.svg.description",
    setup({ addViewer }) {
        addViewer({
            id: "svg-viewer",
            pageTitle: "$viewer.svg.title",
            route: "/svg-viewer",
            formats: ["svg"],
            render: (dataUrl: string) => {
                return <SVGPage dataUrl={dataUrl}/>
            },
            headerButtons: [
                {
                    text: "$viewer.svg.transform",
                    shortcut: "q",
                    action() {
                        document.body.dispatchEvent(new Event("transformAction"));
                    }
                }
            ]
        });
    },
    i18n,
    native: true
};