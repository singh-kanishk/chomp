import { create } from "zustand";

interface UseUserStoreInterface {
  masterHash: Uint8Array | null;
  email: string | null;
  salt: string | null; // Changed to string to match your API response
  
  setMasterHash: (hash: Uint8Array | null) => void;
  setEmail: (email: string | null) => void;
  setSalt: (salt: string | null) => void;
  
}

export const useUserStore = create<UseUserStoreInterface>((set) => ({
  masterHash: null,
  email: null,
  salt: null,

  setSalt: (salt) => set({ salt }),
  setMasterHash: (masterHash) => set({ masterHash }),
  setEmail: (email) => set({ email }),
  
 
}));