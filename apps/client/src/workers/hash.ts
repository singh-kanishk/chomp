import * as Comlink from "comlink";
import { argon2id, createBLAKE3 } from "hash-wasm";

const encoder = new TextEncoder();

export function generateSaltUuid() {
    return crypto.randomUUID();
  }
const hashingService = {
  async generateMasterHash(password: string, salt: string) {
    try {
      return await argon2id({
        password: password,
        salt: encoder.encode(salt + ":master"),
        iterations: 3,
        memorySize: 65536,
        hashLength: 32,
        parallelism: 1,
        outputType: "binary",
      });
    } catch {
      throw new Error("Worker Error: Master Hash failed");
    }
  },

  async generateAuthHash(
    masterHash: Uint8Array,
    salt: string,
  ): Promise<string> {
    const hasher = await createBLAKE3(256, masterHash);
    hasher.init();
    hasher.update(encoder.encode(salt + ":auth"));
    return hasher.digest();
  },

  async generateEncryptionKey(
    masterHash: Uint8Array,
    salt: string,
  ): Promise<string> {
    const hasher = await createBLAKE3(256, masterHash);
    hasher.init();
    hasher.update(encoder.encode(salt + ":key"));
    return hasher.digest();
  },
};

Comlink.expose(hashingService);

export type HashingService = typeof hashingService;
