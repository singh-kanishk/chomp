import { create } from "zustand";

type SortField = "name" | "strength" | "group";

interface VaultUIState {
  sortBy: SortField;
  sortOrder: "asc" | "desc";
  expandedId: string | null;
  revealedIds: string[];
  visibleLimit: number;
  copiedState: { id: string; type: "username" | "password" } | null;

  // Actions
  toggleSort: (field: SortField) => void;
  toggleExpand: (id: string) => void;
  toggleReveal: (id: string, e: React.MouseEvent) => void;
  triggerCopy: (text: string, id: string, type: "username" | "password") => void;
  loadMore: (max: number) => void;
  showLess: () => void;
}

export const useVaultUIStore = create<VaultUIState>((set, get) => ({
  sortBy: "name",
  sortOrder: "asc",
  expandedId: null,
  revealedIds: [],
  visibleLimit: 10,
  copiedState: null,

  toggleSort: (field) => {
    const { sortBy, sortOrder } = get();
    if (sortBy === field) {
      set({ sortOrder: sortOrder === "asc" ? "desc" : "asc" });
    } else {
      set({ sortBy: field, sortOrder: "asc" });
    }
  },

  toggleExpand: (id) => {
    set({ expandedId: get().expandedId === id ? null : id });
  },

  toggleReveal: (id, e) => {
    e.stopPropagation();
    const current = get().revealedIds;
    set({
      revealedIds: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  },

  triggerCopy: (text, id, type) => {
    navigator.clipboard.writeText(text);
    set({ copiedState: { id, type } });
    setTimeout(() => set({ copiedState: null }), 2000);
  },

  loadMore: (maxTotal) => {
    set({ visibleLimit: Math.min(get().visibleLimit + 5, maxTotal) });
  },

  showLess: () => set({ visibleLimit: 5 }),
}));