import { z } from "zod";

const GetCredentialResponseBodyZod = z.object({
  credentialName: z.string(),
  credentialData: z.string(),
});

const GetCredentialResponseZod = z.object({
  nextOffset: z.number(),
  credentials: z.array(GetCredentialResponseBodyZod),
});

export type GetCredentialResponse = z.infer<typeof GetCredentialResponseZod>;
