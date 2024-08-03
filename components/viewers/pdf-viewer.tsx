"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@nextui-org/button";
import { pdfjs, Document, Page } from "react-pdf";

import Viewer, { ViewerProps } from ".";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

/** @see https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#legacy-pdfjs-worker */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`,
    import.meta.url,
).toString();

interface PDFViewerProps extends ViewerProps {}

interface PDFViewerState {
    value: string
    currentPage: number
    totalPages: number
}

export default class PDFViewer extends Viewer<PDFViewerProps, PDFViewerState> {
    public constructor(props: PDFViewerProps) {
        super(props, "PDF查看器");

        this.state = {
            value: "", // doc url,
            currentPage: 1,
            totalPages: 0
        };
    }

    private changePage = (delta: number) => {
        if(this.state.currentPage + delta < 1 || this.state.currentPage + delta > this.state.totalPages) return;

        this.setState({ currentPage: this.state.currentPage + delta });
    }

    public render(): React.ReactNode {
        return (
            <div className="w-full h-full flex flex-col items-center">
                <div className="w-full h-6 mb-2 px-4 flex justify-between">
                    <div className="flex items-center">
                        <Button
                            variant="light"
                            size="sm"
                            isIconOnly
                            disableAnimation
                            isDisabled={this.state.currentPage === 1}
                            onPress={() => this.changePage(-1)}>
                            <ArrowLeft size={15}/>
                        </Button>
                        <Button
                            variant="light"
                            size="sm"
                            isIconOnly
                            disableAnimation
                            isDisabled={this.state.currentPage === this.state.totalPages}
                            onPress={() => this.changePage(1)}>
                            <ArrowRight size={15}/>
                        </Button>
                        <span className="text-default-400 text-sm ml-2">{this.props.fileName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-default-400 text-sm">第 {this.state.currentPage} 页 / 共 {this.state.totalPages} 页</span>
                        <span className="text-default-400 text-sm font-semibold">React PDF</span>
                    </div>
                </div>
                
                <div className="rounded-lg overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-default-200 hover:scrollbar-thumb-default-300 active:scrollbar-thumb-default-400 scrollbar-thumb-rounded-sm">
                    <Document
                        file={this.state.value}
                        onLoadSuccess={({ numPages }) => this.setState({ totalPages: numPages })}>
                        <Page pageNumber={this.state.currentPage}/>
                    </Document>
                </div>
            </div>
        );
    }

    public async componentDidMount() {
        this.setState({ value: URL.createObjectURL(new Blob([Buffer.from(await this.loadFile())])) });
    }

    public componentWillUnmount() {
        URL.revokeObjectURL(this.state.value);
        this.setState({ value: "" });
    }
}
