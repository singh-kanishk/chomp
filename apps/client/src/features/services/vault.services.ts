import * as Comlink from "comlink";
import { apiCall } from "@/lib/api-call-wrapper";
import { type HashingService } from "@/workers/hash";
import HashWorker from "@/workers/hash?worker";
import type { CredentialBody,  GetCredentialRequest } from "@chomp/shared";
import type { GetCredentialResponse } from "@chomp/shared";
import { CredentialBodyZod } from "@chomp/shared";
import { useUserStore } from "@/store/useUserStore";

const worker = new HashWorker();
const cryptoWorker = Comlink.wrap<HashingService>(worker);
export class VaultServices {
  public getCredential = async ({
    limit,
    offset,
  }: GetCredentialRequest) => {
    try {
      const { encryptionKey } = useUserStore.getState();
      const query = await apiCall<GetCredentialResponse>({
        url: `/api/credential?limit=${limit}&offset=${offset}`,
        method: "GET",
      });
      if (!query.success) {
        throw new Error(query.message);
      }

      if (!encryptionKey) {
        throw new Error("No Encryption Key Available Try Again Or Re Login");
      }

      if (query.body) {
        const decryptedCredential: CredentialBody[]=[]
        // 1. Map to an array of pending promises (they start working in parallel)
        const decryptionPromises = query.body.credentials.map(async (item) => {
          const credential = await cryptoWorker.decrypt(
            item.credentialData,
            encryptionKey,
          );
          const obj = CredentialBodyZod.parse(JSON.parse(credential));
          decryptedCredential.push(obj);
        });

        // 2. Properly block until all items are decrypted and saved
        await Promise.all(decryptionPromises);
        return {decryptedCredential,nextOffset:query.body.nextOffset}
      }
    } catch (error) {
      throw error;
    }
  };
}
