import "@/styles/globals.css";
import "@/styles/toastify.css";
import "react-toastify/dist/ReactToastify.css";
import { Metadata, Viewport } from "next";
import { clsx } from "clsx";

import { Providers } from "./providers";

import { fontNoto, fontSans } from "@/config/fonts";

export const metadata: Metadata = {
	title: {
		default: "Ferrum",
		template: "Ferrum - %s",
	},
	description: "Explore throughout your server.",
	icons: {
		icon: "/icon.png",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning lang="zh-cn">
			<head />
			<body className={clsx("m-0 p-0 w-[100vw] h-[100vh]", fontNoto.className, fontSans.className)}>
				<Providers themeProps={{
					attribute: "class",
					defaultTheme: "system",
					storageKey: "ferrum-theme",
				}}>
					{children}
				</Providers>
			</body>
		</html>
	);
}
