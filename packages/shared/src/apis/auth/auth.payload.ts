import z, { string } from "zod";

export interface LoginPayload {
  uuid: string;
}

export const SignUpRequestZod = z.object({
  encryptedName: string(),
  email: string(),
  authHash: string(),
  salt: string(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestZod>;

export const LogInRequestZod = z.object({
  email: string(),
  authHash: string(),
});

export type LogInRequest = z.infer<typeof LogInRequestZod>;
