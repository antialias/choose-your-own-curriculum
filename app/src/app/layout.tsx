import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { NavBar } from '@/components/NavBar';

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
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
