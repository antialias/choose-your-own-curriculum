import type { Metadata } from "next";
import "./globals.css";
import "../styles/index.css";
import "@/styled-system/styles.css";
import "katex/dist/katex.min.css";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { NavBar } from "@/components/NavBar";
import I18nProvider from "@/components/I18nProvider";
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
  const lng = 'en';
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider session={session}>
            <I18nProvider lng={lng}>
              <NavBar />
              {children}
            </I18nProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
