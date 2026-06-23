import type { CredentialFrontend, Group, Strength } from "@chomp/shared";

export interface CredentialStoreInterface extends CredentialFrontend {
  setId: (id: string) => void;
  setName: (name: string) => void;
  setUserName: (username: string) => void;
  setPassword: (password: string) => void;
  setGroup: (group: Group) => void;
  setStrength: (strength: Strength) => void;
  setWebsiteUrl: (url: string) => void;
  setNotes: (notes: string) => void;
  setLastUpdated: (time: string) => void;
  setIsFavourite: (isFavourite: boolean) => void;
}

export type TabType = "vault" | "generator" | "audit" | "settings";

export type GroupType = "All" | Group;
