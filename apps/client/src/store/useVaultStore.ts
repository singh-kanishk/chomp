import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CredentialFrontend } from "@chomp/shared";
import { INITIAL_CREDENTIALS } from "@/features/dashboard/initialData";

interface VaultState {
  credentialFrontend: CredentialFrontend[];

  // Actions
  saveCredential: (
    newData: Omit<CredentialFrontend, "id" | "strength">,
    editingId?: string,
  ) => void;
  upgradePassword: (id: string, newPassword: string) => void;
  deleteCredential: (id: string) => void;
  clearVault: () => void;
  resetToDefaults: () => void;
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

export const useVaultStore = create<VaultState>()(
  persist(
    (set, get) => ({
      credentialFrontend: INITIAL_CREDENTIALS,

      saveCredential: (newData, editingId) => {
        const newStrength = analyzeStrength(newData.password);
        const currentDate = new Date().toISOString().split("T")[0];

        set((state) => {
          if (editingId) {
            return {
              credentialFrontend: state.credentialFrontend.map((c) =>
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
          return { credentialFrontends: [newCred, ...state.credentialFrontend] };
        });
      },

      upgradePassword: (id, newPassword) => {
        set((state) => ({
          credentialFrontend: state.credentialFrontend.map((c) =>
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
          credentialFrontend: state.credentialFrontend.filter((c) => c.id !== id),
        }));
      },

      clearVault: () => set({ credentialFrontend: [] }),

      resetToDefaults: () => set({ credentialFrontend: INITIAL_CREDENTIALS }),

      importBackup: (imported) => {
        set((state) => ({ credentialFrontend: [...imported, ...state.credentialFrontend] }));
      },

      getExportString: () => JSON.stringify(get().credentialFrontend, null, 2),
    }),
    {
      name: "chomp_vault_secrets", // Replaces your manual localStorage key
    },
  ),
);
