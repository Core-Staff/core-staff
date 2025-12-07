import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Effeciency",
  description: "Effeciency Application",
  icons: {
    icon: "/brand/icon_color.svg",
    shortcut: "/brand/icon_color.svg",
    apple: "/brand/icon_color.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
