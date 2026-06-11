import z, { string } from "zod";

export interface LoginPayload {
  uuid: string;
}

export const SignUpRequestZod = z.object({
  name: string(),
  email: string(),
  authHash: string(),
  salt: string(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestZod>;
