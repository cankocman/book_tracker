
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  uuid,
  date,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // Added password field
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

// Application Specific Tables

export const books = pgTable("book", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  totalPages: integer("total_pages").notNull(),
  currentPage: integer("current_page").notNull().default(0),
  status: text("status", { enum: ["read", "reading", "want-to-read"] }).notNull().default("want-to-read"),
  coverUrl: text("cover_url"),
  startDate: timestamp("start_date", { mode: "date" }),
  finishDate: timestamp("finish_date", { mode: "date" }),
  rating: integer("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const readingSessions = pgTable("reading_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  pagesRead: integer("pages_read").notNull(),
  date: timestamp("date", { mode: "date" }).defaultNow(),
  durationMinutes: integer("duration_minutes"), // Optional: track duration
  notes: text("notes"), // Optional: quick note for the session
});

export const notes = pgTable("note", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookId: uuid("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  pageReference: integer("page_reference"), // Optional: page number reference
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
