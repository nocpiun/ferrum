import { nextui } from "@nextui-org/theme";
import scrollbar from "tailwind-scrollbar";

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        noto: ["var(--font-noto)"],
      },
      colors: {
        danger: "#e70d0d"
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    scrollbar({ nocompatible: true, preferredStrategy: "pseudoelements" }),
  ],
}
