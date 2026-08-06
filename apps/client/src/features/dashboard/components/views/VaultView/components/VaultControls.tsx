import { Search, ArrowUpDown } from "lucide-react";
import { type GroupType } from "@chomp/shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVaultUIStore } from "@/store/useVaultUiStore";

const GROUPS: GroupType[] = ["All", "Personal", "Work", "Social", "Finance"];

export function VaultControls() {
  const { searchQuery, setSearchQuery, selectedGroup, setSelectedGroup } =
    useDashboardStore();
  const { sortBy, toggleSort } = useVaultUIStore();

  return (
    <div className="space-y-2.5">
      <div className="flex flex-row items-center justify-between gap-2">
        <h3 className="font-headline text-sm sm:text-lg text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <span className="text-[#ffb77d]">✦</span> Crypts
        </h3>

        <div className="flex items-center gap-1.5 flex-1 max-w-[280px] justify-end">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border pl-7 pr-2 py-1 text-xs text-muted-foreground focus:outline-none focus:border-[#ffb77d] font-mono placeholder:text-muted-foreground/40 h-7 sm:h-8 rounded-none w-full"
            />
            <Search className="w-3 h-3 text-muted-foreground/40 absolute left-2 top-1/2 -translate-y-1/2" />
          </div>

          <Button
            onClick={() => toggleSort("name")}
            variant="outline"
            className={`h-7 sm:h-8 px-2 flex items-center gap-1 bg-card border-border text-xs font-mono uppercase tracking-wider text-muted-foreground hover:border-[#ffb77d] hover:text-[#ffb77d] rounded-none shrink-0 ${
              sortBy === "name" ? "border-[#ffb77d] text-[#ffb77d]" : ""
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none antialiased">
        {GROUPS.map((group) => (
          <Button
            key={group}
            onClick={() => setSelectedGroup(group)}
            variant="outline"
            className={`px-3 py-1 h-auto font-mono text-[11px] uppercase tracking-wider rounded-none shrink-0 ${
              selectedGroup === group
                ? "bg-[#4b5320] border-[#c3cc8c] text-[#bdc787] shadow-[0_0_10px_rgba(195,204,140,0.15)]"
                : "bg-card border-border text-muted-foreground hover:border-[#ffb77d] hover:text-[#ffb77d]"
            }`}
          >
            {group}
          </Button>
        ))}
      </div>
    </div>
  );
}