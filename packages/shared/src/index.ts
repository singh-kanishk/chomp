export type UserContext = {
  id: string;
  role: "admin" | "user";
};

export const BaseUrl = {
  server: "http://localhost:3000",
  deployedServer: "https://3-231-121-16.nip.io",
  client: "http://localhost:5173",
  deployedClient: "https://chomp-frontend-murex.vercel.app/",
  db: "http://localhost:5432",
} as const;

export * from "./apis/auth/auth.schema.js";
export * from "./types.js";
export * from "./apis/auth/auth.payload.js";
export * from "./apis/apis/api.request.js";
export * from "./apis/apis/api.response.js";
export * from "./apis/vaultSchema/credential.schema.js";