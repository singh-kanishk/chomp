CREATE TABLE "credentials" (
	"user_id" uuid,
	"credential_id" text PRIMARY KEY NOT NULL,
	"credential_payload" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "secrets" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"salt_uuid" uuid NOT NULL,
	"auth_hash" text NOT NULL,
	"protected_encryption_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"user_id" uuid,
	"refresh_token" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"isActive" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secrets" ADD CONSTRAINT "secrets_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;