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
import { headers } from "next/headers";
import { authOptions } from "@/authOptions";
import { initI18next } from "@/i18n";

export const metadata: Metadata = {
  title: "Choose Your Own Curriculum",
  description: "Track and plan your learning journey",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("accept-language")?.split(",")[0] ?? "en";
  const i18n = await initI18next(locale);
  const session = await getServerSession(authOptions);
  return (
    <html lang={locale}>
      <body>
        <I18nProvider i18n={i18n}>
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
