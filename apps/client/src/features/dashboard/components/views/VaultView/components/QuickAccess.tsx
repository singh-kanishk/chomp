import { Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVaultStore } from "@/store/useVaultStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVaultUIStore } from "@/store/useVaultUiStore";

export function QuickAccess() {
  const credentials = useVaultStore((state) => state.credentials);
  const openPortalModal = useDashboardStore((state) => state.openPortalModal);
  const { expandedId, toggleExpand, triggerCopy } = useVaultUIStore();

  const quickList = credentials.slice(0, 3);

  return (
    <section className="space-y-1.5 font-mono">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
          <span className="text-[#ffb77d]">✦</span> Quick Access
        </span>
        <span className="text-[10px] text-muted-foreground/40 hidden sm:inline">
          Fast Keys
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {quickList.map((cred) => {
          const firstChar = cred.name.charAt(0).toUpperCase();
          const isExpanded = expandedId === cred.id;

          return (
            <div
              key={`quick-${cred.id}`}
              onClick={() => toggleExpand(cred.id)}
              className={`stone-slab hover-ignite p-2 cursor-pointer flex items-center justify-between gap-2 border transition-all h-[42px] ${
                isExpanded ? "border-[#ffb77d] bg-[#353534]/50" : "border-border"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 bg-[#2a2a2a] border border-border flex items-center justify-center text-xs font-headline text-[#ffb77d] shrink-0">
                  {firstChar}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-muted-foreground group-hover:text-[#ffb77d] transition-colors truncate leading-tight">
                    {cred.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 truncate leading-tight">
                    {cred.username}
                  </p>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCopy(cred.password, cred.id, "password");
                }}
                size="icon-xs"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground/60 hover:text-[#ffb77d] hover:bg-transparent shrink-0 p-0"
                title="Copy Password"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => openPortalModal()}
          className="stone-slab hover-ignite px-2.5 py-1.5 cursor-pointer flex items-center justify-center gap-1.5 border-dashed border-border hover:border-[#ffb77d] hover:bg-[#ffb77d]/5 transition-all text-muted-foreground/60 hover:text-[#ffb77d] text-xs uppercase tracking-wider h-[42px]"
        >
          <Plus className="w-3.5 h-3.5 text-[#ffb77d]" />
          <span className="text-[11px] truncate">Add Key</span>
        </button>
      </div>
    </section>
  );
}