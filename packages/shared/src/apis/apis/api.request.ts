import z from "zod";
export const GetCredentialRequestZod = z.object({
  offset:z.coerce.number(),
  limit:z.coerce.number()
})
export type GetCredentialRequest = z.infer<typeof GetCredentialRequestZod> 