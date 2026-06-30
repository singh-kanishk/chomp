import z from "zod";
export const GetCredentialRequestZod = z.object({
  offset:z.coerce.number(),
  limit:z.coerce.number()
})
export type GetCredentialRequest = z.infer<typeof GetCredentialRequestZod>;
 
export const VaultMutationRequestZod = z.object({
  credentialId: z.string(),
  credentialData: z.string(),
});
export type VaultMutationRequest = z.infer<typeof VaultMutationRequestZod>;

export const DeleteCredentialRequestZod = z.object({
  credentialId: z.string(),
});
export type DeleteCredentialRequest = z.infer<typeof DeleteCredentialRequestZod>;