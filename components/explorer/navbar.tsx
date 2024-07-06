"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";

const Navbar: React.FC = () => {
    return (
        <Breadcrumbs className="w-[1000px]">
            <BreadcrumbItem>test</BreadcrumbItem>
            <BreadcrumbItem>test</BreadcrumbItem>
            <BreadcrumbItem>test</BreadcrumbItem>
            <BreadcrumbItem>test</BreadcrumbItem>
        </Breadcrumbs>
    );
}

export default Navbar;
