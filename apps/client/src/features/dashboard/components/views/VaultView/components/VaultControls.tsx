import { Search, ArrowUpDown } from "lucide-react";
import { type GroupType } from "@chomp/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVaultUIStore } from "@/store/useVaultUiStore";

const GROUPS: GroupType[] = ["All", "Personal", "Work", "Social", "Finance"];

export function VaultControls() {
  const { searchQuery, setSearchQuery, selectedGroup, setSelectedGroup } = useDashboardStore();
  const { sortBy, toggleSort } = useVaultUIStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pb-2">
        <h3 className="font-headline text-xl text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2">
          <span className="text-[#ffb77d]">✦</span> Credential Vault
        </h3>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Live search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0e0e0e] border-[#47483c] pl-8 pr-3 py-1 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] font-mono placeholder:text-[#c8c7b8]/40 h-8 rounded-none"
            />
            <Search className="w-3.5 h-3.5 text-[#c8c7b8]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <Button
            onClick={() => toggleSort("name")}
            variant="outline"
            className={`h-8 flex items-center gap-1 bg-[#201f1f] border-[#47483c] text-xs font-mono uppercase tracking-wider text-[#c8c7b8] hover:border-[#ffb77d] hover:text-[#ffb77d] rounded-none ${
              sortBy === "name" ? "border-[#ffb77d] text-[#ffb77d]" : ""
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sort</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none antialiased">
        {GROUPS.map((group) => (
          <Button
            key={group}
            onClick={() => setSelectedGroup(group)}
            variant="outline"
            className={`px-4 py-1.5 h-auto font-mono text-xs uppercase tracking-widest rounded-none ${
              selectedGroup === group
                ? "bg-[#4b5320] border-[#c3cc8c] text-[#bdc787] shadow-[0_0_10px_rgba(195,204,140,0.15)]"
                : "bg-[#201f1f] border-[#47483c] text-[#c8c7b8] hover:border-[#ffb77d] hover:text-[#ffb77d]"
            }`}
          >
            {group}
          </Button>
        ))}
      </div>
    </div>
  );
}