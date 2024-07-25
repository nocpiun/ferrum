import { isURL } from "validator";

import fileTypes from "./store/file-types.json";

import { BytesType } from "@/types";

export function getCurrentState<T>(setState: React.Dispatch<React.SetStateAction<T>>): Promise<T> {
    return new Promise((resolve, _reject) => {
        setState((currentState) => {
            resolve(currentState);

            return currentState;
        });
    });
}

export function bytesSizeTransform(bytes: number, from: BytesType, to: BytesType, fixed: number = 2): { value: string, type: BytesType } {
    return {
        value: (bytes * Math.pow(1024, from - to)).toFixed(fixed),
        type: to
    };
}

export function getBytesType(type: BytesType): string {
    switch(type) {
        case BytesType.B: return "B";
        case BytesType.KB: return "KB";
        case BytesType.MB: return "MB";
        case BytesType.GB: return "GB";
        case BytesType.TB: return "TB";
    }
}

export function getFileTypeName(extname?: string): string {
    if(!extname) return "文件";
    extname = extname.toLowerCase();

    for(let item of fileTypes) {
        for(let ext of item.extensions) {
            if(extname === ext) {
                return item.name;
            }
        }
    }

    return "文件";
}

export function isValidPath(path: string): boolean {
    return isURL(path.replaceAll(" ", "_"), {
        require_protocol: false,
        require_host: false,
        require_port: false,
        require_tld: false,
        allow_fragments: true,
        allow_protocol_relative_urls: false,
        allow_query_components: false
    });
}
