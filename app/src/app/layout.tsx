import type { Metadata } from "next";
import "./globals.css";
import { AppNavBar } from "@/components/AppNavBar";

export const metadata: Metadata = {
  title: "Choose Your Own Curriculum",
  description: "Track and plan your learning journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppNavBar />
        {children}
      </body>
    </html>
  );
}
