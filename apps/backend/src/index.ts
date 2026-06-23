import express, { type Request, type Response } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import cors from "cors";
import { authRouter } from "./routes/auth/auth.routes.js";
import postgres from "postgres";
import pinoHttp from "pino-http";
import { logger } from "./logger/logger.js";

import * as schema from "./modals/SchemaDb/schema.js";
const queryClient = postgres(process.env.DATABASE_URL!);

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  pinoHttp({
    logger, 
  }),
);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export const db = drizzle(queryClient, { schema });
