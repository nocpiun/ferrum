/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import MonacoEditor from "@monaco-editor/react";
import Axios from "axios";

// containers
import Header from "../containers/editor/Header";

import { EditorProps, EditorState, GetFileContentResponse } from "../types";

const hostname = "http://"+ window.location.hostname;
const apiUrl = hostname +":3001";

export default class Editor extends Component<EditorProps, EditorState> {
    private path: string;

    public constructor(props: EditorProps) {
        super(props);

        this.state = {
            editorLanguage: "text",
            editorValue: ""
        };
        this.path = "C:"+ this.props.path.replaceAll("\\", "/");
    }

    public render(): ReactElement {
        return (
            <div className="editor">
                <div className="main-container">
                    <Header path={decodeURI(this.path)}/>
                    <div className="text-container">
                        <MonacoEditor
                            defaultLanguage={this.state.editorLanguage}
                            value={this.state.editorValue}
                            theme="vs-dark"
                            onChange={(value) => {
                                this.setState({editorValue: value ? value : ""})
                            }}/>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Ferrum - "+ this.path;

        Axios.get(apiUrl +"/getFileContent?path="+ this.path.replaceAll("/", "\\"))
            .then((res: GetFileContentResponse) => {
                if(res.data.err == 404) {
                    alert("Cannot find the specified file.\nPlease check your path.");
                    return;
                }

                this.setState({
                    editorLanguage: res.data.format,
                    editorValue: res.data.content
                });
            })
            .catch((err) => {throw err});
        
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key == "s") {
                e.preventDefault();

                Axios.post(apiUrl +"/saveFileContent", {path: this.path, content: this.state.editorValue})
                    .then(() => {
                        alert("File Saved.\nPath: "+ this.path);
                    })
                    .catch((err) => {throw err});
            }
        });
    }
}
