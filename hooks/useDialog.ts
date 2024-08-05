import { create } from "zustand";

export type DialogType = "renameFolder" | "renameFile" | "removeFolder" | "removeFile";

export interface DialogStore<D = any> {
    type: DialogType | null;
    data: D | null;
    isOpened: boolean;
    open: (type: DialogType, data?: D) => void;
    close: () => void;
}

export const useDialog = create<DialogStore>((set) => ({
    type: null,
    data: null,
    isOpened: false,
    open: (type: DialogType, data?: any) => set({ type, data, isOpened: true }),
    close: () => set({ type: null, data: null, isOpened: false }),
}));
