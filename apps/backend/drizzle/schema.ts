import { pgTable, unique, uuid, text, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	userId: uuid("user_id").defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	isActive: boolean().default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const credentials = pgTable("credentials", {
	userId: uuid("user_id"),
	credentialId: text("credential_id").primaryKey().notNull(),
	credentialPayload: text("credential_payload").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "credentials_user_id_users_user_id_fk"
		}).onDelete("cascade"),
]);

export const secrets = pgTable("secrets", {
	userId: uuid("user_id").primaryKey().notNull(),
	saltUuid: uuid("salt_uuid").notNull(),
	authHash: text("auth_hash").notNull(),
	protectedEncryptionKey: text("protected_encryption_key").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "secrets_user_id_users_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	userId: uuid("user_id"),
	refreshToken: text("refresh_token").primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "session_user_id_users_user_id_fk"
		}).onDelete("cascade"),
]);
