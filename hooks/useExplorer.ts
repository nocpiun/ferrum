import { create } from "zustand";
import { isURL } from "validator";
import { to } from "preps";

interface ExplorerStore {
    path: string[]
    disk: string

    setPath: (path: string[]) => boolean
    setDisk: (disk: string) => void
    stringifyPath: () => string
    enterPath: (target: string) => void
    back: () => void
}

function stringifyPath(path: string[]) {
    return decodeURIComponent(
        path.join("/").replace("root", path.length === 1 ? "/" : "")
    );
}

export const useExplorer = create<ExplorerStore>((set, get) => ({
    path: ["root"],
    disk: "",

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
    setDisk: (disk: string) => set({ disk }),
    stringifyPath: () => stringifyPath(get().path),
    enterPath: (target: string) => {
        set({ path: [...get().path, target] });
    },
    back: () => {
        const { path } = get();
        
        if(path.length === 1) return;
        set({ path: to(path).remove(path.length - 1).f() });
    }
}));
