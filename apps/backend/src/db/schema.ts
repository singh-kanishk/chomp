
import {text, pgTable, timestamp,uuid, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    userId: uuid('user_id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    authHash: text('auth_hash').notNull(),
    createdAt: timestamp("created_at", { 
    withTimezone: true, 
    mode: "date" 
  }).notNull().defaultNow()
});
