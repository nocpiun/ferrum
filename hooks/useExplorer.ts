import { create } from "zustand";
import { isURL } from "validator";

interface ExplorerStore {
    path: string[]

    setPath: (path: string[]) => boolean
    stringifyPath: () => string
}

function stringifyPath(path: string[]) {
    return decodeURIComponent(
        path.join("/").replace("root", path.length === 1 ? "/" : "")
    );
}

export const useExplorer = create<ExplorerStore>((set, get) => ({
    path: [],

    setPath: (path) => {
        if(
            (
                path.length === 1 &&
                path[0] === "root"
            ) ||
            isURL(stringifyPath(path), {
                require_protocol: false,
                require_host: false,
                require_port: false,
                require_tld: false,
                allow_fragments: true,
                allow_protocol_relative_urls: false,
                allow_query_components: false
            })
        ) {
            set({ path });

            return true;
        }
        
        return false;
    },
    stringifyPath: () => stringifyPath(get().path),
}));
