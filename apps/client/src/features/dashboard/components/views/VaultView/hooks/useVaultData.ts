import { useMemo } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVaultStore } from "@/store/useVaultStore";
import { useVaultUIStore } from "@/store/useVaultUiStore";

export function useVaultData() {
  const { searchQuery, selectedGroup } = useDashboardStore();
  const { credentials } = useVaultStore();
  const { sortBy, sortOrder } = useVaultUIStore();

  const filteredCredentials = useMemo(() => {
    return credentials.filter((cred) => {
      const matchesGroup = selectedGroup === "All" || cred.group === selectedGroup;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        cred.name.toLowerCase().includes(q) ||
        cred.username.toLowerCase().includes(q) ||
        (cred.websiteUrl && cred.websiteUrl.toLowerCase().includes(q)) ||
        cred.group.toLowerCase().includes(q);

      return matchesGroup && matchesSearch;
    });
  }, [credentials, selectedGroup, searchQuery]);

  const sortedCredentials = useMemo(() => {
    return [...filteredCredentials].sort((a, b) => {
      let comp = 0;
      if (sortBy === "name") comp = a.name.localeCompare(b.name);
      else if (sortBy === "group") comp = a.group.localeCompare(b.group);
      else if (sortBy === "strength") {
        const val = { Strong: 3, Medium: 2, Weak: 1 };
        comp = (val[a.strength as keyof typeof val] || 0) - (val[b.strength as keyof typeof val] || 0);
      }
      return sortOrder === "asc" ? comp : -comp;
    });
  }, [filteredCredentials, sortBy, sortOrder]);

  const securityScore = useMemo(() => {
    if (credentials.length === 0) return 100;
    let total = 0;
    credentials.forEach((c) => {
      if (c.strength === "Strong") total += 100;
      else if (c.strength === "Medium") total += 55;
      else total += 15;
    });
    return Math.round(total / credentials.length);
  }, [credentials]);

  return { credentials, sortedCredentials, securityScore };
}