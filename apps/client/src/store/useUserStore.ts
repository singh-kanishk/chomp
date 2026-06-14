import { create } from "zustand";

interface UseUserStoreInterface {
  masterHash: Uint8Array | null;
  email: string | null;
  salt: string | null;
  encryptionKey: Uint8Array | null;
  setEncryptionKey: (key: Uint8Array) => void;
  setMasterHash: (hash: Uint8Array | null) => void;
  setEmail: (email: string | null) => void;
  setSalt: (salt: string | null) => void;
}

export const useUserStore = create<UseUserStoreInterface>((set) => ({
  masterHash: null,
  email: null,
  salt: null,
  encryptionKey: null,

  setEncryptionKey: (key) => {
    set({ encryptionKey: key });
  },
  setSalt: (salt) => set({ salt }),
  setMasterHash: (masterHash) => set({ masterHash }),
  setEmail: (email) => set({ email }),
}));
