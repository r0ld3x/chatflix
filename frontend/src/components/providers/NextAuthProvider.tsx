// @ts-nocheck
"use client";

import { authOptions } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider session={authOptions}>{children}</SessionProvider>;
};

export default NextAuthProvider;
