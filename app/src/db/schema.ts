import { sqliteTable, text, integer, primaryKey, blob } from 'drizzle-orm/sqlite-core';
import crypto from 'node:crypto';

export const users = sqliteTable('user', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
});

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    pk: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    pk: primaryKey(vt.identifier, vt.token),
  })
);

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', { mode: 'boolean' }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    pk: primaryKey(authenticator.userId, authenticator.credentialID),
  })
);

export const students = sqliteTable('student', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email'),
  accountUserId: text('accountUserId').references(() => users.id, {
    onDelete: 'set null',
  }),
});

export const teacherStudents = sqliteTable(
  'teacher_student',
  {
    teacherId: text('teacherId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    studentId: text('studentId')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
  },
  (ts) => ({
    pk: primaryKey(ts.teacherId, ts.studentId),
  })
);

export const uploadedWork = sqliteTable('uploaded_work', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  studentId: text('studentId')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),
  dateUploaded: integer('dateUploaded', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  dateCompleted: integer('dateCompleted', { mode: 'timestamp_ms' }),
  summary: text('summary'),
  embeddings: text('embeddings'),
  originalDocument: blob('originalDocument', { mode: 'buffer' }),
});

export const tags = sqliteTable('tag', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  text: text('text').notNull().unique(),
});

export const topicDags = sqliteTable('topic_dag', {
  id: text('id').primaryKey().notNull().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  topics: text('topics').notNull(),
  graph: text('graph').notNull(),
  dateCreated: integer('dateCreated', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

