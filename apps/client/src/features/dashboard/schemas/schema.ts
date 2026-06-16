export interface Credential {
  id: string;
  name: string;
  username: string;
  password: string;
  group: "Personal" | "Work" | "Social" | "Finance";
  strength: "Strong" | "Medium" | "Weak";
  websiteUrl?: string;
  notes?: string;
  lastUpdated?: string;
  isFavorite?: boolean;
}

export type TabType = "vault" | "generator" | "audit" | "settings";

export type GroupType = "All" | "Personal" | "Work" | "Social" | "Finance";
