import type { Drive } from "@/types";

import { create } from "zustand";

interface FerrumStore {
    disks: Drive[]

    setDisks: (disks: Drive[]) => void
    getMountedList: () => string[]
}

export const useFerrum = create<FerrumStore>((set, get) => ({
    disks: [],

    setDisks: (disks) => set({ disks }),
    getMountedList: () => get().disks.map((disk) => disk.mount),
}));
