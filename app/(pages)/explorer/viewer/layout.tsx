import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full px-10 pt-1">
            {children}
        </div>
    );
}
