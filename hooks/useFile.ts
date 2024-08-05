import type { DirectoryItemOperations } from "@/types";

import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";

import { useExplorer } from "./useExplorer";

interface FileOperations extends DirectoryItemOperations {}

export function useFile(path: string): FileOperations {
    const explorer = useExplorer();
    const fullPath = explorer.disk + path;

    return {
        rename: async (newName: string) => {
            if(/[\\\/:*?"<>|]/.test(newName)) {
                toast.warn(`文件名称中不能包含下列任何字符 \\ / : * ? " < > |`);
    
                return;
            }
            
            return new Promise(async (resolve, reject) => {
                try {
                    const { status } = await axios.post(
                        `/api/fs/file?path=${fullPath}`,
                        { newName },
                        {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    );
                    
                    if(status === 200) {
                        toast.success("修改成功");
                        resolve();
                    }
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
                        case 409:
                            toast.error(`文件名称冲突 (${status})`);
                            break;
                        case 500:
                            toast.error(`服务器内部错误 (${status})`);
                            break;
                    }

                    reject(status);
                }
            });
        },
        remove: async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const { status } = await axios.delete(`/api/fs/file?path=${fullPath}`);
                    
                    if(status === 200) {
                        toast.success("删除成功");
                        resolve();
                    }
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

                    reject(status);
                }
            });
        }
    };
}
