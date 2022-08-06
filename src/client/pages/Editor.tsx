import { Component, Context, ReactElement } from "react";
import AceEditor from "react-ace";
import { toast, Toaster } from "react-hot-toast";
import Axios from "axios";

import MainContext from "../contexts/MainContext";

// containers
import Header from "../containers/editor/Header";

// ace configure
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";

import {
    EditorProps,
    EditorState,
    GetFileContentResponse,
    MainContextType
} from "../types";
import { apiUrl, editorDefaultValue } from "../global";
// import * as config from "../../config.json";
import Utils from "../../Utils";

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
    public static contextType?: Context<MainContextType> | undefined = MainContext;
    private static root: string;

    private path: string;
    private aceInstance: AceEditor | null = null;

    public constructor(props: EditorProps, context: MainContextType) {
        super(props);

        Editor.root = context.config.explorer.root;

        this.state = {
            editorLanguage: "text",
            editorValue: ""
        };
        this.path = Editor.root + this.props.path.replaceAll("\\", "/");
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
                            if(this.aceInstance) this.aceInstance.editor.undo();
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
                            fontSize={this.context.config.editor.fontSize}
                            wrapEnabled={this.context.config.editor.autoWrap}
                            highlightActiveLine={this.context.config.editor.highlightActiveLine}
                            enableBasicAutocompletion={true}
                            showPrintMargin={false}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                showLineNumbers: this.context.config.editor.lineNumber,
                            }}
                            onChange={(v) => {
                                this.setState({editorValue: v});
                            }}/>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Ferrum - "+ decodeURI(this.path);

        if(!this.context.isDemo) {
            Axios.get(apiUrl +"/getFileContent?path="+ this.path.replaceAll("/", "\\"))
            .then((res: GetFileContentResponse) => {
                if(res.data.err == 404) {
                    toast.error(Utils.$("toast.msg10"));
                    return;
                }

                this.setState({
                    editorLanguage: res.data.format,
                    editorValue: res.data.content
                });
            })
            .catch((err) => {throw err});
        } else {
            this.setState({
                editorLanguage: "txt",
                editorValue: editorDefaultValue
            });
        }
        
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if(e.ctrlKey && e.key == "s") {
                e.preventDefault();

                this.saveFile();
            }
        });

        window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
            // display a message when the user is about to leave the page
            return e.returnValue = "";
        });
    }

    private saveFile(): void {
        if(this.context.isDemo) return;

        Axios.post(apiUrl +"/saveFileContent", {path: decodeURI(this.path), content: this.state.editorValue})
            .then(() => {
                toast.success(Utils.$("toast.msg11") +" ("+ decodeURI(this.path) +")");
            })
            .catch((err) => {throw err});
    }
}
