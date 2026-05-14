import { argon2id, blake3 } from "hash-wasm";
const encoder = new TextEncoder();


export function generateSaltUuid(){
    return crypto.randomUUID();
}
export async function generateMasterHash(
  password: string,
  salt: string,
): Promise<Uint8Array> {
  try {
    return  (await argon2id({
      password: password,
      salt: encoder.encode(salt + ":master"),
      parallelism: 1,
      iterations: 3,
      memorySize: 65536,
      hashLength: 32,
      outputType: "binary",
    })) as Uint8Array;

  } catch {
    throw new Error("Error while generating hash");
  }
}
export async function generateAuthHash(masterHash: Uint8Array, salt: string) {
  try {
    return await blake3({
      initKey: masterHash,
      hashLen: 32,
      data: encoder.encode(salt + ":auth"),
    });

  } catch {
    throw new Error("Error while generating hash");
  }
}
export async function generateEncryptionKey(
  masterHash: Uint8Array,
  salt: string,
) {
  try {
    return await blake3({
      initKey: masterHash,
      hashLen: 32,
      data: encoder.encode(salt + ":key"),
    });
  } catch {
    throw new Error("Error while generating key");
  }
}
