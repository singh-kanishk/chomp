import * as Comlink from "comlink";
import { argon2id, createBLAKE3 } from "hash-wasm";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function generateSaltUuid(): string {
  return crypto.randomUUID();
}

// Helper utilities for high-performance, stack-safe Base64 conversion in Workers
// High-performance chunked alternative for larger payloads
function bytesToBase64(bytes: Uint8Array): string {
  const CHUNK_SIZE = 0x8000; // 32768
  const chunks: string[] = [];

  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    chunks.push(String.fromCharCode(...chunk));
  }

  return btoa(chunks.join(""));
}

function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

const hashingService = {
  async generateMasterHash(
    password: string,
    salt: string,
  ): Promise<Uint8Array> {
    try {
      return await argon2id({
        password: password,
        salt: encoder.encode(salt + ":master"),
        iterations: 3,
        memorySize: 65536,
        hashLength: 32,
        parallelism: 1,
        outputType: "binary", // Returns Uint8Array
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
    return hasher.digest("hex");
  },

  async generateEncryptionKey(masterHash: Uint8Array, salt: string) {
    const hasher = await createBLAKE3(256, masterHash);
    hasher.init();
    hasher.update(encoder.encode(salt + ":key"));
    return hasher.digest("binary");
  },

  async getCryptoKey(keyData: Uint8Array): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      "raw",
      new Uint8Array(keyData),
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"],
    );
  },

  async encrypt(data: string, secretKeyBytes: Uint8Array): Promise<string> {
    try {
      const encodedData = encoder.encode(data);
      const key = await this.getCryptoKey(secretKeyBytes);

      // 12-byte IV generation is perfect
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedData,
      );

      const encryptedBytes = new Uint8Array(encryptedBuffer);
      const combined = new Uint8Array(iv.length + encryptedBytes.length);
      combined.set(iv, 0);
      combined.set(encryptedBytes, iv.length);

      return bytesToBase64(combined);
    } catch {
      throw new Error("Encryption Failed");
    }
  },

  async decrypt(
    cipherText: string,
    secretKeyBytes: Uint8Array,
  ): Promise<string> {
    try {
      const key = await this.getCryptoKey(secretKeyBytes);
      const combined = base64ToBytes(cipherText);

      if (combined.length < 12) {
        throw new Error("Ciphertext too short");
      }

      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data,
      );

      return decoder.decode(decryptedBuffer);
    } catch {
      throw new Error("Decryption failed. Invalid key or corrupted data.");
    }
  },
};

Comlink.expose(hashingService);

export type HashingService = typeof hashingService;
