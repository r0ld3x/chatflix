import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { NextUiProvider } from "@/components/providers/NextUiProvider";
import { cn } from "@nextui-org/react";
import type { Metadata } from "next";
import "./globals.css";

import TanstackProvider from "@/components/providers/TanstackProvider";
import { Poppins, Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChatFlix",
  description: "A web app for doing chats",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          roboto.className,
          poppins.variable,
          "dark text-foreground bg-background min-h-screen overflow-hidden "
        )}
      >
        <NextAuthProvider>
          <NextUiProvider>
            <TanstackProvider>{children}</TanstackProvider>
            <ToastContainer />
          </NextUiProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
