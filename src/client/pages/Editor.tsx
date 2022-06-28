import { Component, ReactElement } from "react";
import AceEditor from "react-ace";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

// containers
import Header from "../containers/editor/Header";

// ace configure
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";

import { EditorProps, EditorState, GetFileContentResponse } from "../types";
import { apiUrl } from "../global";
import * as config from "../../config.json";
import Emitter from "../utils/emitter";

const root = config.explorer.root;

/**
 * In order to make the browser not display a message if the file didn't change,
 * a state named 'hasChanged' is needed.
 * 
 * 'hasChanged' will be set to true when the file is changed,
 * and set to false when the file is saved.
 * 
 * Also, an event named 'fileStatusChange' will be emitted when the file is changed or saved.
 * This can help the header component to update the status (edited or not) of the file.
 */

export default class Editor extends Component<EditorProps, EditorState> {
    private path: string;
    private aceInstance: AceEditor | null = null;

    public constructor(props: EditorProps) {
        super(props);

        this.state = {
            editorLanguage: "text",
            editorValue: "",
            hasChanged: false
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
                    <Header
                        path={decodeURI(this.path)}
                        onSaveFile={() => this.saveFile()}
                        onUndo={() => {
                            // When you click the undo button or press ctrl+z while the file didn't change,
                            // the editor will clear all the content in the file.
                            if(this.aceInstance && this.state.hasChanged) this.aceInstance.editor.undo();
                        }}/>
                    <div className="text-container">
                        <AceEditor
                            ref={(ace) => this.aceInstance = ace}
                            name="ferrum-editor"
                            mode={this.state.editorLanguage}
                            theme="chrome"
                            value={this.state.editorValue}
                            width="700px"
                            height="525px"
                            fontSize={config.editor.fontSize}
                            wrapEnabled={config.editor.autoWrap}
                            highlightActiveLine={config.editor.highlightActiveLine}
                            enableBasicAutocompletion={true}
                            showPrintMargin={false}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                showLineNumbers: config.editor.lineNumber,
                            }}
                            onChange={(v) => {
                                this.setState({editorValue: v, hasChanged: true});
                                Emitter.get().emit("fileStatusChange", true);
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
                    toast.error("无法找到指定文件");
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

                this.saveFile();
            }
        });

        window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
            // display a message when the user is about to leave the page
            if(this.state.hasChanged) return e.returnValue = "";
        });
    }

    private saveFile(): void {
        Axios.post(apiUrl +"/saveFileContent", {path: this.path, content: this.state.editorValue})
            .then(() => {
                this.setState({hasChanged: false});
                Emitter.get().emit("fileStatusChange", false);
                toast.success("文件已保存 ("+ this.path +")");
            })
            .catch((err) => {throw err});
    }
}
