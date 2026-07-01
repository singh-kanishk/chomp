import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VaultServices } from "@/features/services/vault.services";
import type { CredentialBody } from "@chomp/shared";

const vaultServices = new VaultServices();

export function useAddCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CredentialBody) =>
      vaultServices.addCredential(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      toast.success("Secret Sealed Successfully", {
        description: "New credential has been encrypted and stored.",
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Add credential failed:", error);
      toast.error("Failed to Seal Secret", {
        description: error.message || "Something went wrong.",
        position: "top-right",
      });
    },
  });
}

export function useUpdateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CredentialBody) =>
      vaultServices.updateCredential(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      toast.success("Crypt Modified Successfully", {
        description: "Credential has been re-encrypted and updated.",
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Update credential failed:", error);
      toast.error("Failed to Modify Crypt", {
        description: error.message || "Something went wrong.",
        position: "top-right",
      });
    },
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentialId: string) =>
      vaultServices.deleteCredential(credentialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      toast.success("Purge Complete", {
        description: "Credential has been permanently removed.",
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Delete credential failed:", error);
      toast.error("Failed to Purge", {
        description: error.message || "Something went wrong.",
        position: "top-right",
      });
    },
  });
}
