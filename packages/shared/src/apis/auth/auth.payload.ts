import z, { string } from "zod";

export interface LoginPayload {
  uuid: string;
}

export const SignUpRequestZod = z.object({
  encryptedName: z.string(),
  email: z.string(),
  authHash: z.string(),
  salt: z.string(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestZod>;

export const LogInRequestZod = z.object({
  email: z.string(),
  authHash: z.string(),
});

export type LogInRequest = z.infer<typeof LogInRequestZod>;

export const JwtPayloadZod = z.object({
  email: z.string(),
});
export type JwtPayloadInterface = z.infer<typeof JwtPayloadZod>;
