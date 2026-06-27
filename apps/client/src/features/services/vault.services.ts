import * as Comlink from "comlink";
import { apiCall } from "@/lib/api-call-wrapper";
import { type HashingService } from "@/workers/hash";
import HashWorker from "@/workers/hash?worker";
import type { GetCredentialRequest } from "@chomp/shared";
import type { GetCredentialResponse } from "@chomp/shared";
import { CredentialPayloadZod } from "@chomp/shared";
import { useUserStore } from "@/store/useUserStore";
import { useVaultStore } from "@/store/useVaultStore";

const worker = new HashWorker();
const cryptoWorker = Comlink.wrap<HashingService>(worker);
export class VaultServices {
  public getCredential = async (credentialCondition: GetCredentialRequest) => {
    try {
      const { encryptionKey } = useUserStore();
      const { saveCredential } = useVaultStore();
      const query = await apiCall<GetCredentialResponse[]>({
        url: `/api/credential?limit=${credentialCondition.limit}&offset=${credentialCondition.offset}`,
        method: "GET",
      });
      if (!query.success) {
        throw new Error(query.message);
      }

      if (!encryptionKey) {
        throw new Error("No Encryption Key Available Try Again Or Re Login");
      }
      if (query.body) {
        // 1. Map to an array of pending promises (they start working in parallel)
        const decryptionPromises = query.body.map(async (item) => {
          const credential = await cryptoWorker.decrypt(
            item.credentialData,
            encryptionKey,
          );
          const obj = CredentialPayloadZod.parse(JSON.parse(credential));
          saveCredential(obj);
        });

        // 2. Properly block until all items are decrypted and saved
        await Promise.all(decryptionPromises);
      }
    } catch (error) {
      throw error;
    }
  };
}
