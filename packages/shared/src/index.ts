
export type UserContext = {
  id: string;
  role: "admin" | "user";
};

export const BaseUrl = {
  server: "http://localhost:3000",
  client: "http://localhost:5173",
  db: "http://localhost:5433",
} as const;

export * from "./apis/auth/auth.schema";
export * from "./types";
export * from "./apis/auth/auth-payload";