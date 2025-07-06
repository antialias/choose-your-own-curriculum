import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

const handler = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.SMTP_FROM,
    }),
  ],
});

export { handler as GET, handler as POST };
