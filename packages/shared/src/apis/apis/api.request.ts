import { number, z } from "zod";
export const GetCredentialRequestZod = z.object({
  offset:number(),
  limit:number()
})
export type GetCredentialRequest = z.infer<typeof GetCredentialRequestZod> 