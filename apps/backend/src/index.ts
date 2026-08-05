import express, { type Request, type Response } from "express";
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
const PORT = 3000;
const HOST = "0.0.0.0";

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chomp-client.vercel.app",
      ...(process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : []),
    ],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use(
  pinoHttp({
    logger,
  }),
);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRouter);
app.use("/api", requireAuth, apiRouter);

app.listen(PORT, HOST,() => {
  console.log(`Backend running on ${HOST}:${PORT}`);
});

export const db = drizzle(queryClient, { schema });
