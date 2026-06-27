import { z } from "zod";

const GROUP_VALUES = ["Personal", "Work", "Social", "Finance", "None"] as const;

export const GroupZod = z.enum(GROUP_VALUES);
export type Group = z.infer<typeof GroupZod>;

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

export type Strength = "Strong" | "Medium" | "Weak" | "InValid";
export type GroupType = "All" | Group;

export const CredentialPayloadZod = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
  group: GroupZod, 
  websiteUrl: z.string().optional(),
  notes: z.string().optional(),
  lastUpdated: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

export type CredentialPayload = z.infer<typeof CredentialPayloadZod>;
