import { relations } from "drizzle-orm/relations";
import { users, credentials, secrets, session } from "./schema";

export const credentialsRelations = relations(credentials, ({one}) => ({
	user: one(users, {
		fields: [credentials.userId],
		references: [users.userId]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	credentials: many(credentials),
	secrets: many(secrets),
	sessions: many(session),
}));

export const secretsRelations = relations(secrets, ({one}) => ({
	user: one(users, {
		fields: [secrets.userId],
		references: [users.userId]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.userId]
	}),
}));