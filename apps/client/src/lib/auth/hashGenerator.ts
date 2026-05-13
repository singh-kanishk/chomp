import { argon2id, blake3 } from "hash-wasm";
const encoder = new TextEncoder();

export async function generateMasterHash(
  password: string,
  salt: string,
): Promise<Uint8Array> {
  try {
    const hash = (await argon2id({
      password: password,
      salt: encoder.encode(salt + ":master"),
      parallelism: 1,
      iterations: 3,
      memorySize: 65536,
      hashLength: 32,
      outputType: "binary",
    })) as Uint8Array;
    return hash;
  } catch {
    throw new Error("Error while generating hash");
  }
}
export async function generateAuthHash(masterHash: Uint8Array, salt: string) {
  try {
    const hash = await blake3({
      initKey: masterHash,
      hashLen: 32,
      data: encoder.encode(salt + ":auth"),
    });
    return hash;
  } catch {
    throw new Error("Error hile generating hash");
  }
}
export async function generateEncryptionKey(
  masterHash: Uint8Array,
  salt: string,
) {
  try {
    const hash = await blake3({
      initKey: masterHash,
      hashLen: 32,
      data: encoder.encode(salt + ":key"),
    });
    return hash;
  } catch {
    throw new Error("Error hile generating key");
  }
}
