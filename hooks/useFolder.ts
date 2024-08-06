import type { DirectoryItemOperations } from "@/types";

import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import { to } from "preps";

import { useExplorer } from "./useExplorer";

import { storage } from "@/lib/storage";
import { starListStorageKey } from "@/lib/global";

interface FolderOperations extends DirectoryItemOperations {
    create: (name: string, type: "folder" | "file") => Promise<void>
    toggleStar: () => void
    getIsStarred: () => boolean
}

export function useFolder(fullPath: string): FolderOperations {
    const explorer = useExplorer();

    return {
        rename: async (newName: string) => {
            if(/[\\\/:*?"<>|]/.test(newName)) {
                toast.warn(`文件夹名称中不能包含下列任何字符 \\ / : * ? " < > |`);
    
                return;
            }

            return new Promise(async (resolve, reject) => {
                try {
                    const { status } = await axios.post(
                        `/api/fs/folder?disk=${explorer.disk}&path=${fullPath}`,
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
                            toast.error(`找不到该文件夹 (${status})`);
                            break;
                        case 409:
                            toast.error(`文件夹名称冲突 (${status})`);
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
                    const { status } = await axios.delete(`/api/fs/folder?disk=${explorer.disk}&path=${fullPath}`);
                    
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
                            toast.error(`找不到该文件夹 (${status})`);
                            break;
                        case 500:
                            toast.error(`服务器内部错误 (${status})`);
                            break;
                    }

                    reject(status);
                }
            });
        },
        create: async (name: string, type: "folder" | "file") => {
            const typeName = type === "folder" ? "文件夹" : "文件";

            if(/[\\\/:*?"<>|]/.test(name)) {
                toast.warn(`${typeName}名称中不能包含下列任何字符 \\ / : * ? " < > |`);
    
                return;
            }

            return new Promise(async (resolve, reject) => {
                try {
                    const { status } = await axios.put(
                        `/api/fs/folder?disk=${explorer.disk}&path=${fullPath}`,
                        { name, type },
                        {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    );
                    
                    if(status === 200) {
                        toast.success("创建成功");
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
                            toast.error(`找不到该文件夹 (${status})`);
                            break;
                        case 409:
                            toast.error(`${typeName}名称冲突 (${status})`);
                            break;
                        case 500:
                            toast.error(`服务器内部错误 (${status})`);
                            break;
                    }

                    reject(status);
                }
            });
        },
        toggleStar: () => {
            if(typeof window === "undefined") return;

            const starList = JSON.parse(storage.getItem(starListStorageKey, JSON.stringify([]))) as string[];
            const targetPath = explorer.disk + fullPath;

            if(starList.includes(targetPath)) {
                storage.setItem(starListStorageKey, JSON.stringify(to(starList).removeItem(targetPath).f()));
            } else {
                storage.setItem(starListStorageKey, JSON.stringify([...starList, targetPath]));
            }
        },
        getIsStarred: () => {
            if(typeof window === "undefined") return false;

            const starList = JSON.parse(storage.getItem(starListStorageKey, JSON.stringify([]))) as string[];
            const targetPath = explorer.disk + fullPath;

            return starList.includes(targetPath);
        }
    };
}
