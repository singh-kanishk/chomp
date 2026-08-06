import { Search, Bell, User, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";

export function Topbar() {
  const {
    activeTab,
    setActiveTab,
    setSearchQuery,
    searchQuery,
    setCustomPrompt,
    openPortalModal,
    toggleSidebar,
  } = useDashboardStore();
  const onSearchChange = (val: string) => {
    setSearchQuery(val);
    if (activeTab !== "vault") setActiveTab("vault");
  };
  const onAddPasswordClick = () => openPortalModal();
  const onProfileClick = () =>
    setCustomPrompt({
      isOpen: true,
      title: "Vault Operator Signet",
      message: "Role: Primary Volcanic Vault Operator",
      type: "info",
    });
  const onNotificationClick = () =>
    setCustomPrompt({
      isOpen: true,
      title: "Sentinel System Update",
      message: "Core Security Audit health score is active.",
      type: "info",
    });

  return (
    <header className="flex justify-between items-center px-3 sm:px-8 lg:px-16 h-14 sm:h-16 lg:h-20 border-b-2 border-border bg-background sticky top-0 z-30 select-none">
      <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground flex-1 min-w-0 mr-2 sm:mr-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-[#ffb77d] hover:bg-[#353534] shrink-0 p-1 h-8 w-8 rounded-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/60 shrink-0" />
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none text-xs sm:text-sm font-mono focus:ring-0 focus:outline-none placeholder-on-surface-variant w-full max-w-[240px] text-muted-foreground truncate"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
        <div className="hidden lg:flex items-center gap-1 bg-popover border border-border px-3 py-1 text-[11px] font-mono text-muted-foreground">
          🛡️ GATEWAY:{" "}
          <span className="text-[#c3cc8c] font-bold">PORT 3000 ACTIVE</span>
        </div>
        <Button
          onClick={onNotificationClick}
          className="p-1 sm:p-1.5 border border-border bg-popover text-muted-foreground hover:text-[#ffb77d] hover:border-[#ffb77d] transition-colors relative h-8 w-8 flex items-center justify-center rounded-none"
          aria-label="Notifications"
        >
          <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffb77d] rounded-full shadow-[0_0_5px_#ffb77d]" />
        </Button>
        <Button
          onClick={onProfileClick}
          className="hidden sm:flex items-center gap-2 border border-border bg-popover pl-2 pr-3 py-1 text-xs font-mono text-muted-foreground hover:border-[#ffb77d] h-8 rounded-none"
        >
          <User className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Operator</span>
        </Button>
        <Button
          onClick={onAddPasswordClick}
          className="bg-[#4b5320] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] px-2.5 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest border border-[#c3cc8c] transition-colors font-bold shadow-[0_0_8px_rgba(195,204,140,0.15)] flex items-center gap-1 cursor-pointer h-8 rounded-none"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Add Password</span>
        </Button>
      </div>
    </header>
  );
}
