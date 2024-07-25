import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className="w-full h-full px-8 pt-1">
            {children}
        </div>
    );
}
