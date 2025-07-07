import type { Metadata } from "next";
import "./globals.css";
import "../styles/index.css";
import AuthProvider from "@/components/AuthProvider";
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
        <AuthProvider session={session}>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
