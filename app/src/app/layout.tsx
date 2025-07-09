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
import { initI18n } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const i18n = await initI18n("en");
  return {
    title: i18n.t("chooseCurriculum"),
    description: i18n.t("siteDescription"),
  };
}

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
