import type { ConfigDataType } from "@/hooks/useWithSettings";
import type { BaseResponseData } from "@/types";

import axios, { type AxiosError } from "axios";
import React from "react";
import { toast } from "react-toastify";

interface GetFileResponseData extends BaseResponseData {
    fileName: string
    size: number
    content: Buffer
}

export interface ViewerProps {
    path: string
    fileName: string
    settings: ConfigDataType
}

export default abstract class Viewer<P extends ViewerProps, S = {}> extends React.Component<P, S> {
    public readonly name: string;

    public constructor(props: P, name: string) {
        super(props);

        this.name = name;
    }

    public abstract render(): React.ReactNode;

    protected async loadFile(isStream: boolean = false): Promise<Buffer | ArrayBuffer> {
        try {
            const { data } = await axios.get<GetFileResponseData | ArrayBuffer>(
                `/api/fs/file?path=${this.props.path}&stream=${isStream ? 1 : 0}`,
                { responseType: isStream ? "arraybuffer" : undefined }
            );

            return isStream ? (data as ArrayBuffer) : (data as GetFileResponseData).content;
        } catch (_err) {
            const err = _err as AxiosError;
            const status = err.response?.status ?? 0;

            switch(status) {
                case 400:
                    toast.error(`该路径无效 (${status})`);
                    break;
                case 401:
                    toast.error(`未登录 (${status})`);
                    break;
                case 403:
                    toast.error(`无效的访问token (${status})`);
                    break;
                case 404:
                    toast.error(`找不到该文件 (${status})`);
                    break;
                case 500:
                    toast.error(`服务器内部错误 (${status})`);
                    break;
            }

            return Buffer.from("");
        }
    }

    protected async saveFile(data: string) {
        try {
            const { status } = await axios.patch(
                `/api/fs/file?path=${this.props.path}`,
                { content: data },
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if(status === 200) toast.success("保存成功");
        } catch (_err) {
            const err = _err as AxiosError;
            const status = err.response?.status ?? 0;

            switch(status) {
                case 400:
                    toast.error(`该路径或请求无效 (${status})`);
                    break;
                case 401:
                    toast.error(`未登录 (${status})`);
                    break;
                case 403:
                    toast.error(`无效的访问token (${status})`);
                    break;
                case 404:
                    toast.error(`找不到该文件 (${status})`);
                    break;
                case 500:
                    toast.error(`服务器内部错误 (${status})`);
                    break;
            }
        }
    }

    public componentDidMount() {
        document.title = this.name +" - "+ this.props.path;
    }
}
