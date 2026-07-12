import { Copy, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVaultStore } from "@/store/useVaultStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVaultUIStore } from "@/store/useVaultUiStore";

export function QuickAccess() {
  const credentials = useVaultStore((state) => state.credentials);
  const openPortalModal = useDashboardStore((state) => state.openPortalModal);
  
  // Now correctly pulling your specific function names
  const { expandedId, toggleExpand, triggerCopy } = useVaultUIStore();

  return (
    <section className="space-y-4">
      <h3 className="font-headline text-xl text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <span className="text-[#ffb77d]">✦</span> Quick Access
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {credentials.slice(0, 3).map((cred) => {
          const firstChar = cred.name.charAt(0).toUpperCase();
          return (
            <div
              key={`quick-${cred.id}`}
              onClick={() => toggleExpand(cred.id)} // Updated
              className={`stone-slab hover-ignite p-5 cursor-pointer flex flex-col justify-between aspect-square group transition-all ${
                expandedId === cred.id ? "border-[#ffb77d] bg-[#353534]/50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-[#2a2a2a] border-2 border-border flex items-center justify-center text-xl font-headline text-[#ffb77d] group-hover:border-[#ffb77d] transition-colors shadow-inner">
                  {firstChar}
                </div>
                <div className="flex gap-1.5">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerCopy(cred.password, cred.id, "password"); // Updated
                    }}
                    size="icon-sm"
                    variant="outline"
                    className="border-border hover:border-[#ffb77d] hover:text-[#ffb77d] text-muted-foreground bg-background"
                    title="Copy Password"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-body text-base font-bold text-muted-foreground group-hover:text-[#ffb77d] transition-colors truncate">
                  {cred.name}
                </h4>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1 truncate">
                  {cred.username}
                </p>
                <div className="mt-2 flex justify-between items-center text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 bg-[#47483c]/30 text-muted-foreground border border-border/50">
                    {cred.group}
                  </span>
                  <span
                    className={`font-bold ${
                      cred.strength === "Strong"
                        ? "text-[#c3cc8c]"
                        : cred.strength === "Medium"
                          ? "text-[#ffb77d]"
                          : "text-[#ffb4ab]"
                    }`}
                  >
                    • {cred.strength}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div
          onClick={() => openPortalModal()}
          className="stone-slab hover-ignite p-5 cursor-pointer flex flex-col justify-between aspect-square border-dashed border-border hover:bg-[#ffb77d]/5 group transition-all"
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <PlusCircle className="w-10 h-10 text-muted-foreground/40 group-hover:text-[#ffb77d] transition-colors mb-2" />
            <span className="font-mono text-xs text-muted-foreground/60 group-hover:text-[#ffb77d] transition-colors uppercase tracking-widest">
              Add Shortcut
            </span>
          </div>
          <div className="text-center font-mono text-[9px] text-muted-foreground/30">
            SLAB SECURE KEY
          </div>
        </div>
      </div>
    </section>
  );
}