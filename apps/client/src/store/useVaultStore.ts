import { create } from "zustand";
import type { CredentialFrontend } from "@chomp/shared";

interface VaultState {
  credentials: CredentialFrontend[];

  // Actions
  setCredentials: (credentials: CredentialFrontend[]) => void;
  saveCredential: (
    newData: Omit<CredentialFrontend, "id" | "strength">,
    editingId?: string,
  ) => void;
  upgradePassword: (id: string, newPassword: string) => void;
  deleteCredential: (id: string) => void;
  clearVault: () => void;
  importBackup: (imported: CredentialFrontend[]) => void;
  getExportString: () => string;
}

const analyzeStrength = (pass: string): "Strong" | "Medium" | "Weak" => {
  if (pass.length < 6) return "Weak";
  const count = [
    /[A-Z]/.test(pass),
    /[a-z]/.test(pass),
    /\d/.test(pass),
    /\W/.test(pass),
  ].filter(Boolean).length;

  if (pass.length >= 12 && count >= 3) return "Strong";
  if (pass.length >= 8 && count >= 2) return "Medium";
  return "Weak";
};

export const useVaultStore = create<VaultState>()((set, get) => ({
  credentials: [],

  setCredentials: (credentials) => set({ credentials }),

  saveCredential: (newData, editingId) => {
    const newStrength = analyzeStrength(newData.password);
    const currentDate = new Date().toISOString().split("T")[0];

    set((state) => {
      if (editingId) {
        return {
          credentials: state.credentials.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  ...newData,
                  strength: newStrength,
                  lastUpdated: currentDate,
                }
              : c,
          ),
        };
      }

      const newCred: CredentialFrontend = {
        ...newData,
        id: Math.random().toString(36).substring(2, 9),
        strength: newStrength,
        lastUpdated: currentDate,
        isFavorite: false,
      };
      
      return { credentials: [newCred, ...state.credentials] };
    });
  },

  upgradePassword: (id, newPassword) => {
    set((state) => ({
      credentials: state.credentials.map((c) =>
        c.id === id
          ? {
              ...c,
              password: newPassword,
              strength: "Strong",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : c,
      ),
    }));
  },

  deleteCredential: (id) => {
    set((state) => ({
      credentials: state.credentials.filter((c) => c.id !== id),
    }));
  },

  clearVault: () => set({ credentials: [] }),

  importBackup: (imported) => {
    set((state) => ({ credentials: [...imported, ...state.credentials] }));
  },

  getExportString: () => JSON.stringify(get().credentials, null, 2),
}));