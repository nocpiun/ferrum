import { isURL } from "validator";

import fileTypes from "./store/file-types.json";

import { BytesType, FileType } from "@/types";

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

export function formatSize(bytes: number, fixed: number = 2): string {
    var size = {
        value: bytes.toFixed(2),
        type: BytesType.B
    };

    if(bytes <= 1024) {
        //
    } else if(bytes > 1024 && bytes <= 1048576) {
        size = bytesSizeTransform(bytes, BytesType.B, BytesType.KB, fixed);
    } else if(bytes > 1048576 && bytes <= 1073741824) {
        size = bytesSizeTransform(bytes, BytesType.B, BytesType.MB, fixed);
    } else if(bytes > 1073741824 && bytes <= 1099511627776) {
        size = bytesSizeTransform(bytes, BytesType.B, BytesType.GB, fixed);
    } else if(bytes > 1099511627776) {
        size = bytesSizeTransform(bytes, BytesType.B, BytesType.TB, fixed);
    }

    return size.value + getBytesType(size.type);
}

export function getFileType(extname: string): FileType | null {
    extname = extname.toLowerCase();

    for(let item of fileTypes) {
        for(let ext of item.extensions) {
            if(extname === ext) {
                return item;
            }
        }
    }

    return null;
}

export function getFileTypeName(extname?: string): string {
    if(!extname) return "文件";

    const fileType = getFileType(extname);
    
    if(fileType?.id === "code") return extname.toUpperCase() +" 源文件";

    return fileType?.name ?? "文件";
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
    }) && (
        path.indexOf("\\") === -1 &&
        path.indexOf(":") === -1 &&
        path.indexOf("*") === -1 &&
        path.indexOf("\"") === -1 &&
        path.indexOf("<") === -1 &&
        path.indexOf(">") === -1 &&
        path.indexOf("|") === -1 &&
        path.indexOf("\/\/") === -1
    );
}

export function concatPath(folderPath: string, currentViewing?: string | null): string {
    return folderPath + (
        currentViewing
        ? (
            folderPath === "/"
            ? currentViewing
            : "/"+ currentViewing
        )
        : ""
    );
}

export function secondToTime(second: number): string {
    const h = Math.floor(second / 3600);
    const m = Math.floor((second - h * 3600) / 60);
    const s = Math.floor(second - h * 3600 - m * 60);

    return `${h < 10 ? ("0" + h) : h}:${m < 10 ? ("0" + m) : m}:${s < 10 ? ("0" + s) : s}`;
}

export function timeToSecond(time: string): number {
    var nums = time.split(":");
    
    if(nums.length === 2) {
        var [m, s] = nums;

        return parseInt(m) * 60 + parseInt(s);
    }
    
    var [h, m, s] = nums;

    return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
}
