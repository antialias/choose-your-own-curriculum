import type { Metadata } from "next";
import "./globals.css";
import "../styles/index.css";
import "@/styled-system/styles.css";
import "katex/dist/katex.min.css";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import I18nProvider from "@/components/I18nProvider";
import { NavBar } from "@/components/NavBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";

export const metadata: Metadata = {
  title: "Choose Your Own Curriculum",
  description: "Track and plan your learning journey",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <QueryProvider>
            <AuthProvider session={session}>
              <NavBar />
              {children}
            </AuthProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
