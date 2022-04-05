import { Component, ReactElement } from "react";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

// containers
import Header from "../containers/editor/Header";

// theme
import { theme } from "../theme";

import { EditorProps, EditorState, GetFileContentResponse } from "../types";
import * as config from "../../config.json";

const hostname = "http://"+ window.location.hostname;
const apiUrl = hostname +":3301";
const root = config.explorer.root;

export default class Editor extends Component<EditorProps, EditorState> {
    private path: string;

    public constructor(props: EditorProps) {
        super(props);

        this.state = {
            editorLanguage: "text",
            editorValue: ""
        };
        this.path = root + this.props.path.replaceAll("\\", "/");
    }

    public render(): ReactElement {
        return (
            <div className="editor">
                <div className="main-container">
                    <div className="toast-container">
                        <Toaster/>
                    </div>
                    <Header path={decodeURI(this.path)}/>
                    <div className="text-container">
                        <MonacoEditor
                            defaultLanguage={this.state.editorLanguage}
                            value={this.state.editorValue}
                            theme={config.editor.theme}
                            beforeMount={(e) => this.monacoWillMount(e)}
                            onMount={(e) => this.monacoDidMount(e)}
                            onChange={(value) => {
                                this.setState({editorValue: value ? value : ""})
                            }}
                            options={{lineNumbers: config.editor.lineNumber}}/>
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
                    toast.error("Cannot find the specified file.");
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
                        toast.success("File Saved. ("+ this.path +")");
                    })
                    .catch((err) => {throw err});
            }
        });
    }

    private monacoWillMount(monaco: Monaco): void {
        monaco.editor.defineTheme("csb-github", theme);
        console.log(monaco);
    }

    private monacoDidMount(editor: any): void {
        editor.focus();
    }
}
