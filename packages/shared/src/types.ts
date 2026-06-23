export interface ApiResponse<T> {
  success: boolean;
  body?: T;
  error?: string;
  message?: string;
  statusCode: number;
}
export interface CredentialFrontend {
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
export interface CredentialBackend {
  id: string;
  name: string;
  username: string;
  password: string;
  group: Group;
  websiteUrl?: string;
  notes?: string;
  lastUpdated?: string;
  isFavorite?: boolean;
}
export type Group = "Personal" | "Work" | "Social" | "Finance" | "None";
export type Strength = "Strong" | "Medium" | "Weak" | "InValid";
export type GroupType = "All" | Group;