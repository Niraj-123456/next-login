import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootContainer from "@next/components/layout/RootContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Login",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootContainer>{children}</RootContainer>
      </body>
    </html>
  );
}
