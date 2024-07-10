"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { to } from "preps";
import {
    Folder,
    FolderRoot,
    FolderGit2,
    FolderDot,
    FolderHeart,
    Music,
    Images,
    Film
} from "lucide-react";

import { useExplorer } from "@/hooks/useExplorer";
import { PropsWithCN } from "@/types";

function getIcon(index: number, folderName: string): React.ReactNode {
    const folderNameLowered = folderName.toLowerCase();
    const size = 18;

    if(index === 0) return <FolderRoot size={size}/>;
    if(folderNameLowered === ".git") return <FolderGit2 size={size}/>;
    if(/^\.\S+/.test(folderNameLowered)) return <FolderDot size={size}/>;
    if(/^(favo(u?)rite(s?))$/.test(folderNameLowered)) return <FolderHeart size={size}/>;
    if(/^(music|song(s?))$/.test(folderNameLowered)) return <Music size={size}/>;
    if(/^(picture(s?)|image(s?))$/.test(folderNameLowered)) return <Images size={size}/>;
    if(/^(video(s?)|film(s?)|movie(s?))$/.test(folderNameLowered)) return <Film size={size}/>;
    
    return <Folder size={size}/>;
}

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
                        {getIcon(index, folderName)}
                        {folderName}
                    </BreadcrumbItem>
                ))
            }
        </Breadcrumbs>
    );
}

export default Navbar;
