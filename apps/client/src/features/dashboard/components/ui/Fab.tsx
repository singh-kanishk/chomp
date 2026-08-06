import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";

export function Fab() {
  const { openPortalModal } = useDashboardStore();
  const onClick = () => openPortalModal();
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full torch-fab flex items-center justify-center z-40 group cursor-pointer shadow-lg"
      id="floating-add-btn"
    >
      <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-secondary transition-all duration-300 group-hover:rotate-90 group-hover:scale-125" />

      {/* Hover Tooltip trigger */}
      <span className="hidden sm:block absolute right-16 bg-[#2a2a2a] border border-[#ffb77d] text-[#ffb77d] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
        Forge New Crypt
      </span>
    </Button>
  );
}
