import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";

export function Fab() {
  const { openPortalModal } = useDashboardStore();
  const onClick = () => openPortalModal();
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-10 right-10 w-14 h-14 rounded-full torch-fab flex items-center justify-center z-40 group cursor-pointer"
      id="floating-add-btn"
    >
      <Plus className="w-7 h-7 text-[#131313] transition-transform duration-300 group-hover:rotate-90" />

      {/* Hover Tooltip trigger */}
      <span className="absolute right-16 bg-[#2a2a2a] border border-[#ffb77d] text-[#ffb77d] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
        Forge New Crypt
      </span>
    </Button>
  );
}
