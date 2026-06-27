import {
  text,
  pgTable,
  timestamp,
  uuid,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { Group, Strength } from "@chomp/shared";

export const usersTable = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  isActive: boolean().default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const secretsTable = pgTable("secrets", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => usersTable.userId, { onDelete: "cascade" }),
  saltUuid: uuid("salt_uuid").notNull(),
  authHash: text("auth_hash").notNull(),
});

export const sessionTable = pgTable("session", {
  userId: uuid("user_id").references(() => usersTable.userId, {
    onDelete: "cascade",
  }),
  refreshToken: text("refresh_token").primaryKey(),
});

export const credentialsTable = pgTable("credentials", {
  userId: uuid("user_id")
    .references(() => usersTable.userId, { onDelete: "cascade" }),
  credentialId: text("credential_id").notNull().primaryKey(),
  credentialPayload:text("credential_payload").notNull()
});
