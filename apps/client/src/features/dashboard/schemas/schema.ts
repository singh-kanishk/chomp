import type { Credential, Group, Strength } from "@chomp/shared";

export interface CredentialStoreInterface extends Credential {
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
