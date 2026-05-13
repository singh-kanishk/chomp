export const getSharedMessage = (): string => {
  return "Hello from the @repo/shared package!";
};

export type UserContext = {
  id: string;
  role: "admin" | "user";
};

export const BaseUrl = {
  server: "http://localhost:3000",
  client: "http://localhost:5173",
  db: "http://localhost:5433",
} as const;

export * from "./zod/form/login-form";
export * from "./zod/form/signup-form";
export * from "./types";
export * from "./zod/api/auth/auth-payload";