"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@nextui-org/dropdown";
import { ArrowLeft, HardDrive, Home, FolderRoot } from "lucide-react";
import { to } from "preps";

import { getFolderIcon } from "./explorer-item";
import DiskItem from "./disk-item";

import { parseStringPath, useExplorer } from "@/hooks/useExplorer";
import { useFerrum } from "@/hooks/useFerrum";
import { isValidPath } from "@/lib/utils";

const Navbar: React.FC = () => {
    const ferrum = useFerrum();
    const explorer = useExplorer();

    const defaultInputPath = useMemo(() => explorer.disk + explorer.stringifyPath(), [explorer]);
    const [inputPath, setInputPath] = useState<string>(defaultInputPath);

    const handleHome = () => {
        explorer.backToRoot();
    };

    const handleBack = () => {
        explorer.back();
    };

    const handleBreadcrumbClick = (index: number) => {
        const { path } = explorer;

        explorer.setPath(to(path).cut(index + 1).f(0));
    };

    const handleInputChange = (value: string) => {
        setInputPath(value);
    };

    const handleInputEnter = useCallback(() => {
        if(inputPath === defaultInputPath) return;
        
        explorer.setPath(parseStringPath(inputPath));
    }, [defaultInputPath, inputPath]);

    useEffect(() => {
        setInputPath(defaultInputPath);
    }, [defaultInputPath]);

    return (
        <>
            <div className="w-[1000px] flex gap-2 mt-2">
                <div className="flex gap-1">
                    <Tooltip content="返回根目录">
                        <Button
                            isIconOnly
                            className="flex justify-center"
                            variant="light"
                            onPress={() => handleHome()}
                            isDisabled={explorer.path.length === 1}>
                            <Home size={20}/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="返回上一级">
                        <Button
                            isIconOnly
                            className="flex justify-center"
                            variant="light"
                            onPress={() => handleBack()}
                            isDisabled={explorer.path.length === 1}>
                            <ArrowLeft size={20}/>
                        </Button>
                    </Tooltip>
                </div>

                <Input
                    className="flex-1"
                    classNames={{
                        input: [
                            "px-1",
                        ],
                    }}
                    autoComplete="off"
                    isInvalid={!isValidPath(inputPath)}
                    errorMessage="请输入有效的路径"
                    value={inputPath}
                    onValueChange={(value) => handleInputChange(value)}
                    onKeyDown={({ key }) => { key === "Enter" && handleInputEnter() }}/>
                
                <Dropdown>
                    <Tooltip content="选择磁盘">
                        <div>
                            <DropdownTrigger>
                                <Button
                                    className="flex justify-center"
                                    variant="light">
                                    <HardDrive size={20}/>
                                    {explorer.disk}
                                </Button>
                            </DropdownTrigger>
                        </div>
                    </Tooltip>
                    <DropdownMenu
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={[explorer.disk]}
                        onSelectionChange={(keys) => {
                            explorer.setDisk(Array.from(keys)[0] as string);
                            explorer.backToRoot();
                        }}>
                        {
                            ferrum.disks.map((disk) => (
                                <DropdownItem
                                    key={disk._mounted}
                                    className="data-[selected=true]:!bg-default-100"
                                    startContent={<HardDrive className="w-4 h-4 mr-2 stroke-default-400"/>}>
                                    <DiskItem {...disk}/>
                                </DropdownItem>
                            ))
                        }
                    </DropdownMenu>
                </Dropdown>
            </div>

            <Breadcrumbs
                className="w-[1000px] px-3 !mt-1"
                maxItems={15}
                itemsBeforeCollapse={3}
                itemsAfterCollapse={5}>
                {
                    explorer.path.map((folderName, index, { length }) => (
                        <BreadcrumbItem
                            classNames={{ item: "gap-1" }}
                            isCurrent={index !== 0 && index === length - 1}
                            isDisabled={index === 0 && length === 1}
                            onPress={() => handleBreadcrumbClick(index)}
                            key={index}>
                            {
                                index === 0
                                ? <FolderRoot size={18}/>
                                : getFolderIcon(folderName, 18)
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
        </>
    );
}

export default Navbar;
