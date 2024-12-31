import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Time To Leave",
	description: "Created by Elijah Cirioli",
	icons: [
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			url: "/favicon/apple-touch-icon.png",
		},
		{
			rel: "icon",
			sizes: "96x96",
			url: "/favicon/favicon-96x96.png",
			type: "image/png",
		},
		{
			rel: "manifest",
			url: "/favicon/site.webmanifest",
		},
		{
			rel: "mask-icon",
			url: "/favicon/safari-pinned-tab.svg",
			color: "#084c8d",
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={dmSans.className}>{children}</body>
		</html>
	);
}
