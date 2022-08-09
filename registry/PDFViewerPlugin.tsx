import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import { PluginMetadata } from "../src/client/types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const PDFPage: React.FC<{ dataUrl: string }> = (props) => {
    const [pageNumber, setPageNumber] = useState(1);

    return (
        <Document
            options={{
                cMapUrl: "pdfjs/cmaps/",
                cMapPacked: true
            }}
            file={props.dataUrl}
            onLoadSuccess={({ numPages }) => setPageNumber(numPages)}
            onLoadError={console.error}
            loading="Loading..."
            error="Failed to load the file."
            noData="">
            {new Array(pageNumber).fill("").map((value, i) => {
                return <Page pageNumber={i + 1} key={i}/>
            })}
        </Document>
    );
}

export const PDFViewerPlugin: PluginMetadata = {
    name: "pdf-viewer",
    displayName: "PDF查看器",
    description: "打开与查看PDF文件",
    setup({ addViewer }) {
        addViewer({
            id: "pdf-viewer",
            pageTitle: "Ferrum PDF查看器",
            route: "/pdf-viewer",
            formats: ["pdf"],
            render: (dataUrl: string) => {
                return <PDFPage dataUrl={dataUrl}/>
            }
        });
    },
    native: true
};
