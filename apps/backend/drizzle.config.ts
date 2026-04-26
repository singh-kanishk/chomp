import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log("Connecting to:", process.env.DATABASE_URL); // Verify this isn't undefined

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
});