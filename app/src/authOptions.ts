import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const db = getDb()

export const authOptions: NextAuthOptions = {
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
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        const { id, role } = user as { id: string; role?: string };
        (session.user as { id?: string; role?: string }).id = id;
        (session.user as { id?: string; role?: string }).role = role;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const allUsers = await db.select({ id: users.id }).from(users);
      if (allUsers.length === 1) {
        await db.update(users).set({ role: 'superadmin' }).where(eq(users.id, user.id));
      }
    },
  },
};
