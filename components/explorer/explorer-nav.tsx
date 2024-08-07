"use client";

import type { DisplayingMode } from "@/types";

import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@nextui-org/dropdown";
import { ArrowLeft, HardDrive, Home, FolderRoot, List, LayoutGrid } from "lucide-react";
import { to } from "preps";
import { usePathname, useRouter } from "next/navigation";

import { getFileIcon, getFolderIcon } from "./explorer-item";
import DiskItem from "./disk-item";

import { parseStringPath, useExplorer } from "@/hooks/useExplorer";
import { useFerrum } from "@/hooks/useFerrum";
import { concatPath, getExtname, isValidPath } from "@/lib/utils";
import { emitter } from "@/lib/emitter";
import { useEmitter } from "@/hooks/useEmitter";

const ExplorerNav: React.FC = () => {
    const ferrum = useFerrum();
    const explorer = useExplorer();
    const router = useRouter();
    const pathname = usePathname();

    const defaultInputPath = useMemo(() => concatPath(explorer.stringifyPath(), explorer.currentViewing), [explorer]);
    const [inputPath, setInputPath] = useState<string>(defaultInputPath);
    const [displayingMode, setDisplayingMode] = useState(explorer.displayingMode);

    /**
     * @returns {boolean} `true` if the viewer is on, `false` otherwise
     */
    function exitViewerIfViewerIsOn(): boolean {
        if(pathname === "/explorer") return false;

        explorer.clearCurrentViewing();
        router.push("/explorer");
        
        return true;
    }

    const handleHome = () => {
        explorer.backToRoot();

        exitViewerIfViewerIsOn();
    };

    const handleBack = () => {
        !exitViewerIfViewerIsOn() && explorer.back();
    };

    const handleBreadcrumbClick = (index: number) => {
        const { path } = explorer;

        explorer.setPath(to(path).cut(index + 1).f(0));
        
        exitViewerIfViewerIsOn();
    };

    const handleInputChange = (value: string) => {
        setInputPath(value);
    };

    const handleInputEnter = useCallback(() => {
        if(inputPath === defaultInputPath) return;
        if(!isValidPath(inputPath)) return;
        
        explorer.setPath(parseStringPath(inputPath));
        
        exitViewerIfViewerIsOn();
    }, [defaultInputPath, inputPath]);

    useEffect(() => {
        setInputPath(defaultInputPath);
    }, [defaultInputPath]);

    useEffect(() => {
        explorer.displayingMode = displayingMode;
        emitter.emit("displaying-mode-change", displayingMode);
    }, [displayingMode]);

    useEmitter([
        ["displaying-mode-change", (current: DisplayingMode) => setDisplayingMode(current)]
    ]);

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
                            isDisabled={explorer.path.length === 1 && !explorer.currentViewing}>
                            <Home size={20}/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="返回上一级">
                        <Button
                            isIconOnly
                            className="flex justify-center"
                            variant="light"
                            onPress={() => handleBack()}
                            isDisabled={explorer.path.length === 1 && !explorer.currentViewing}>
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
                
                <Dropdown isDisabled={pathname === "/explorer/viewer"}>
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
                            exitViewerIfViewerIsOn();
                            explorer.setDisk(Array.from(keys)[0] as string);
                            explorer.backToRoot();
                        }}>
                        {
                            ferrum.disks.map((disk) => (
                                <DropdownItem
                                    key={disk._mounted}
                                    className="data-[selected=true]:!bg-default-100"
                                    startContent={<HardDrive className="w-4 h-4 mr-2 stroke-default-400"/>}
                                    aria-label={disk._mounted}>
                                    <DiskItem {...disk}/>
                                </DropdownItem>
                            ))
                        }
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className="w-[1000px] flex justify-between items-center">
                <Breadcrumbs
                    className="px-3"
                    maxItems={15}
                    itemsBeforeCollapse={3}
                    itemsAfterCollapse={5}
                    aria-label="文件夹路径">
                    {
                        explorer.path.map((folderName, index, { length }) => (
                            <BreadcrumbItem
                                classNames={{ item: "gap-1" }}
                                isCurrent={index !== 0 && index === length - 1 && !explorer.currentViewing}
                                isDisabled={index === 0 && length === 1 && !explorer.currentViewing}
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
                    {
                        explorer.currentViewing
                        ? (
                            <BreadcrumbItem
                                classNames={{ item: "gap-1" }}
                                isCurrent>
                                {getFileIcon(getExtname(explorer.currentViewing))}
                                {explorer.currentViewing}
                            </BreadcrumbItem>
                        )
                        : null
                    }
                </Breadcrumbs>

                <div className="flex gap-1 relative">
                    <div
                        className="absolute top-0 left-0 bottom-0 w-8 h-8 bg-default-100 rounded-lg transition-all"
                        style={{ transform: `translateX(calc((2rem + 0.25rem) * ${displayingMode === "list" ? 0 : 1}))` }}/>

                    <Tooltip content="列表视图">
                        <Button
                            variant="light"
                            size="sm"
                            isIconOnly
                            disableAnimation
                            disabled={displayingMode === "list"}
                            onPress={() => setDisplayingMode("list")}>
                            <List size={17}/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="网格视图">
                        <Button
                            variant="light"
                            size="sm"
                            isIconOnly
                            disableAnimation
                            disabled={displayingMode === "grid"}
                            onPress={() => setDisplayingMode("grid")}>
                            <LayoutGrid size={17}/>
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </>
    );
}

export default ExplorerNav;
