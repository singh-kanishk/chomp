import { useState, useEffect } from "react";
import type { Credential } from "@/features/dashboard/schemas/schema";
import { INITIAL_CREDENTIALS } from "@/features/dashboard/initialData";

export function useVault() {
  const [credentials, setCredentials] = useState<Credential[]>(
    () => INITIAL_CREDENTIALS,
  );

  useEffect(() => {
    localStorage.setItem("chomp_vault_secrets", JSON.stringify(credentials));
  }, [credentials]);

  const handleSaveCredential = (
    newData: Omit<Credential, "id" | "strength">,
    editingId?: string,
  ) => {
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

    const newStrength = analyzeStrength(newData.password);
    const currentDate = new Date().toISOString().split("T")[0];

    if (editingId) {
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...newData,
                strength: newStrength,
                lastUpdated: currentDate,
              }
            : c,
        ),
      );
    } else {
      const newCred: Credential = {
        ...newData,
        id: Math.random().toString(36).substring(2, 9),
        strength: newStrength,
        lastUpdated: currentDate,
        isFavorite: false,
      };
      setCredentials((prev) => [newCred, ...prev]);
    }
  };

  const handleUpgradePassword = (id: string, newPassword: string) => {
    setCredentials((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              password: newPassword,
              strength: "Strong",
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : c,
      ),
    );
  };

  const handleClearVault = () => setCredentials([]);
  const handleResetToDefaults = () => setCredentials(INITIAL_CREDENTIALS);
  const handleImportBackup = (imported: Credential[]) => {
    setCredentials((prev) => [...imported, ...prev]);
  };
  const getExportString = () => JSON.stringify(credentials, null, 2);
  const deleteCredential = (id: string) => {
    setCredentials((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    credentials,
    handleSaveCredential,
    handleUpgradePassword,
    handleClearVault,
    handleResetToDefaults,
    handleImportBackup,
    getExportString,
    deleteCredential,
  };
}
