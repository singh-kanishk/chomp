import { create } from "zustand";
import type {
  TabType,
  GroupType
} from "@/features/dashboard/schemas/schema";
import type { CredentialFrontend } from "@chomp/shared";
import type { CustomPromptConfig } from "@/features/dashboard/components/modals/CustomPrompt";

interface DashboardState {
  // Navigation & Filtering
  activeTab: TabType;
  selectedGroup: GroupType;
  searchQuery: string;

  // Security & App State
  isLocked: boolean;

  // Modals & Overlays
  isModalOpen: boolean;
  editingCredential: CredentialFrontend | null;
  showHelp: boolean;
  customPrompt: CustomPromptConfig | null;

  // Actions
  setActiveTab: (tab: TabType) => void;
  setSelectedGroup: (group: GroupType) => void;
  setSearchQuery: (query: string) => void;
  setIsLocked: (locked: boolean) => void;
  openPortalModal: (credentialFrontend?: CredentialFrontend | null) => void;
  closePortalModal: () => void;
  setShowHelp: (show: boolean) => void;
  setCustomPrompt: (prompt: CustomPromptConfig | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: "vault",
  selectedGroup: "All",
  searchQuery: "",
  isLocked: false,
  isModalOpen: false,
  editingCredential: null,
  showHelp: false,
  customPrompt: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsLocked: (locked) => set({ isLocked: locked }),

  openPortalModal: (credentialFrontend = null) =>
    set({ isModalOpen: true, editingCredential: credentialFrontend }),

  closePortalModal: () => set({ isModalOpen: false, editingCredential: null }),

  setShowHelp: (show) => set({ showHelp: show }),
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
}));
