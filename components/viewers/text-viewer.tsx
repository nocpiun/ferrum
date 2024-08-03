"use client";

import React from "react";
import AceEditor from "react-ace";
import { Button } from "@nextui-org/button";
import { Copy, Save } from "lucide-react";
import { toast } from "react-toastify";

import "ace-builds";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/ext-language_tools";
import "@/styles/ace.css";

import Viewer, { ViewerProps } from ".";

interface TextViewerProps extends ViewerProps {}

interface TextViewerState {
    value: string
    edited: boolean
}

export default class TextViewer extends Viewer<TextViewerProps, TextViewerState> {
    public constructor(props: TextViewerProps) {
        super(props, "文本编辑器");

        this.state = {
            value: "",
            edited: false
        };
    }

    private async handleSave() {
        await this.saveFile();
        this.setState({ edited: false });
    }

    private handleCopy() {
        navigator.clipboard.writeText(this.state.value);
        toast.success("已复制");
    }

    public render(): React.ReactNode {
        return (
            <div className="w-full h-full flex flex-col items-center">
                <div className="w-full h-6 mb-2 px-4 flex justify-between">
                    <div className="flex items-center">
                        <Button variant="light" size="sm" isIconOnly disableAnimation onPress={() => this.handleSave()}>
                            <Save size={15}/>
                        </Button>
                        <Button variant="light" size="sm" isIconOnly disableAnimation onPress={() => this.handleCopy()}>
                            <Copy size={15}/>
                        </Button>
                        <span className="text-default-400 text-sm ml-2">{this.props.fileName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-default-400 text-sm">{this.state.edited ? "*已修改" : "已保存"}</span>
                        <span className="text-default-400 text-sm font-semibold">Ace Editor</span>
                    </div>
                </div>

                <AceEditor
                    theme="ambiance"
                    name="ferrum-ace-editor"
                    width="900px"
                    fontSize={16}
                    showPrintMargin={false}
                    enableBasicAutocompletion
                    enableLiveAutocompletion
                    value={this.state.value}
                    setOptions={{
                        wrap: true,
                        wrapBehavioursEnabled: true
                    }}
                    onChange={(value) => {
                        this.setState({ value, edited: true });
                    }}/>
            </div>
        );
    }

    public async componentDidMount() {
        const buffer = Buffer.from(await this.loadFile());

        this.setState({ value: buffer.toString("utf-8") });
    }
}
