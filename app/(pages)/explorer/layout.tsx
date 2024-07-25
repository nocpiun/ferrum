import type { PropsWithChildren } from "react";

import Navbar from "@/components/explorer/navbar";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full pb-10 flex flex-col items-center space-y-3">
            <Navbar />

            <div className="w-[1000px] h-[78vh] flex gap-7">
                {children}
            </div>
        </div>
    );
}
