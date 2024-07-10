"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";

import { useExplorer } from "@/hooks/useExplorer";
import { PropsWithCN } from "@/types";

const Navbar: React.FC<PropsWithCN> = ({ className }) => {
    const explorer = useExplorer();

    return (
        <Breadcrumbs className={className}>
            {
                explorer.path.map((value, index) => (
                    <BreadcrumbItem key={index}>{value}</BreadcrumbItem>
                ))
            }
        </Breadcrumbs>
    );
}

export default Navbar;
