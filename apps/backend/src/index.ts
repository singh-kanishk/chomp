import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Loads the root .env file for local development (in Docker, variables are injected by docker-compose)
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
import { drizzle } from "drizzle-orm/postgres-js";
import cors from "cors";
import { authRouter } from "./routes/auth/auth.routes.js";
import { apiRouter } from "./routes/api/api.routes.js";
import { requireAuth } from "./middleware/authWare.js";
import postgres from "postgres";
import pinoHttp from "pino-http";
import { logger } from "./logger/logger.js";
import cookieParser from "cookie-parser";

import * as schema from "./modals/SchemaDb/schema.js";
const queryClient = postgres(process.env.DATABASE_URL!);

const app = express();
const PORT  =  3000;
const HOST = '0.0.0.0';

app.use(
  cors({
    origin: ["http://localhost:5173", "https://chomp-frontend-murex.vercel.app"],
    credentials: true,
  }),
);

app.use(cookieParser())
app.use(express.json());

app.use(
  pinoHttp({
    logger, 
  }),
);
app.use("/auth", authRouter);
app.use("/api", requireAuth, apiRouter);

app.listen(PORT, HOST,() => {
  console.log(`Backend running on ${HOST}:${PORT}`);
});

export const db = drizzle(queryClient, { schema });
