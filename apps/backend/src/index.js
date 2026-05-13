import express from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import cors from "cors";
import { authRouter } from "./router/auth/authRoute.js";
export const db = drizzle(process.env.DATABASE_URL);
const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
