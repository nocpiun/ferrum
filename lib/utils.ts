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
