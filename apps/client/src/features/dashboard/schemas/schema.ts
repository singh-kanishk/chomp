type Group = "Personal" | "Work" | "Social" | "Finance" | "None";
type Strength = "Strong" | "Medium" | "Weak" | "InValid";
export interface Credential {
  id: string;
  name: string;
  username: string;
  password: string;
  group: Group;
  strength: Strength;
  websiteUrl?: string;
  notes?: string;
  lastUpdated?: string;
  isFavorite?: boolean;
}
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

export type GroupType = "All" | "Personal" | "Work" | "Social" | "Finance";
