import type { PropsWithChildren } from "react";

import ExplorerNav from "@/components/explorer/explorer-nav";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full pb-9 flex flex-col items-center">
            <ExplorerNav />

            <div className="w-[1000px] h-0 flex-grow flex gap-7">
                {children}
            </div>
        </div>
    );
}
