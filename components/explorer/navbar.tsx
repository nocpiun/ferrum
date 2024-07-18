"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { FolderRoot } from "lucide-react";
import { to } from "preps";

import { getIcon } from "./explorer-item";

import { useExplorer } from "@/hooks/useExplorer";
import { PropsWithCN } from "@/types";

const Navbar: React.FC<PropsWithCN> = ({ className }) => {
    const router = useRouter();
    const explorer = useExplorer();

    const handleClick = (index: number) => {
        const { path } = explorer;

        explorer.setPath(to(path).cut(index + 1).f(0));
        router.push("/x/root"+ explorer.stringifyPath());
    };

    return (
        <Breadcrumbs
            className={className}
            maxItems={15}
            itemsBeforeCollapse={3}
            itemsAfterCollapse={5}>
            {
                explorer.path.map((folderName, index, { length }) => (
                    <BreadcrumbItem
                        classNames={{ item: "gap-1" }}
                        isCurrent={index !== 0 && index === length - 1}
                        isDisabled={index === 0 && length === 1}
                        onClick={() => handleClick(index)}
                        key={index}>
                        {
                            index === 0
                            ? <FolderRoot size={18}/>
                            : getIcon(folderName, 18)
                        }
                        {
                            index === 0
                            ? explorer.disk
                            : decodeURIComponent(folderName)
                        }
                    </BreadcrumbItem>
                ))
            }
        </Breadcrumbs>
    );
}

export default Navbar;
