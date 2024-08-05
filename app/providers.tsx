"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ToastContainer } from "react-toastify";

import RenameFolderDialog from "@/components/dialogs/rename-folder-dialog";
import RenameFileDialog from "@/components/dialogs/rename-file-dialog";
import RemoveFolderDialog from "@/components/dialogs/remove-folder-dialog";
import RemoveFileDialog from "@/components/dialogs/remove-file-dialog";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

	return (
		<NextUIProvider navigate={router.push}>
			<NextThemesProvider {...themeProps}>
				{children}
				<ToastContainer
					toastClassName="!bg-content1 !text-default-foreground !shadow-lg border border-default-100"
					position="bottom-right"
					hideProgressBar/>
				
				{/* Dialogs */}
				<RenameFolderDialog />
				<RenameFileDialog />
				<RemoveFolderDialog />
				<RemoveFileDialog />
			</NextThemesProvider>
		</NextUIProvider>
	);
}
