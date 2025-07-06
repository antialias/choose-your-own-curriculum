import NextAuth, { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import EmailProvider from 'next-auth/providers/email';

export const dynamic = 'force-dynamic';
const getAuthOptions = (): NextAuthOptions => {
  const globalAny = globalThis as { prisma?: PrismaClient };
  const prisma = globalAny.prisma ?? new PrismaClient();
  if (!globalAny.prisma && process.env.NODE_ENV !== 'production') {
    globalAny.prisma = prisma;
  }
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT) || 587,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
  };
};

export function GET(req: Request) {
  return NextAuth(getAuthOptions())(req);
}

export const POST = GET;
