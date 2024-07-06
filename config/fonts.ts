import { Noto_Sans_SC as FontNoto, Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const fontNoto = FontNoto({
	variable: "--font-noto",
});
