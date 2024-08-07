import type { PropsWithChildren } from "react";

import Navbar from "@/components/explorer/navbar";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full pb-10 flex flex-col items-center">
            <Navbar />

            <div className="w-[1000px] h-[79vh] flex gap-7">
                {children}
            </div>
        </div>
    );
}
