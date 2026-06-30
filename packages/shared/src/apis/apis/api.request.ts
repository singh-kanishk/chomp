import z from "zod";
export const GetCredentialRequestZod = z.object({
  offset:z.number(),
  limit:z.number()
})
export type GetCredentialRequest = z.infer<typeof GetCredentialRequestZod> 