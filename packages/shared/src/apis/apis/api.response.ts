import z, { string } from "zod";

export const GetCredentialResponseZod = z.object({
  credentialName: string(),
  credentialData: string(),
});
export type GetCredentialResponse = z.infer<typeof GetCredentialResponseZod> 

