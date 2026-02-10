
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React from "react";

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
