import { text, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    userId: uuid("user_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
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
    saltUuid: uuid("salt_uuid").notNull().defaultRandom(),
    authHash: text("auth_hash").notNull(),
});
