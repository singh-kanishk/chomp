import { create } from "zustand";
import type { CredentialStoreInterface } from "@/features/dashboard/schemas/schema";

export const useCredentialsStore = create<CredentialStoreInterface>((set) => ({
  id: "",
  name: "",
  username: "",
  password: "",
  group: "None",
  strength: "InValid",
  websiteUrl: "",
  notes: "",
  lastUpdated: "",
  isFavorite: false,
  setId: function (id) {
    set({ id });
  },
  setGroup: function (group) {
    set({ group });
  },
  setName: function (name) {
    set({ name });
  },
  setUserName: function (username) {
    set({ username });
  },
  setPassword: function (password) {
    set({ password });
  },
  setIsFavourite: function (isFavorite) {
    set({ isFavorite });
  },
  setLastUpdated: function (lastUpdated) {
    set({ lastUpdated });
  },
  setNotes: function (notes) {
    set({ notes });
  },
  setStrength: function (strength) {
    set({ strength });
  },
  setWebsiteUrl: function (websiteUrl) {
    set({ websiteUrl });
  },
}));
