import {
  Lock,
  HelpCircle,
  LogOut,
  Plus,
  Key,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GroupType } from "../../schemas/schema";
import { useDashboardStore } from "@/store/useDashboardStore";

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    selectedGroup,
    setSelectedGroup,
    openPortalModal,
    setShowHelp,
    setIsLocked,
  } = useDashboardStore();

  const onNewSecretClick = () => openPortalModal();
  const onHelpClick = () => setShowHelp(true);
  const onLockClick = () => setIsLocked(true);

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-[#2a2a2a] border-r-4 border-[#353534] shadow-[5px_0_0_0_rgba(0,0,0,0.3)] flex flex-col z-40">
      <div className="p-6 border-b-2 border-border select-none">
        <h1 className="font-headline text-3xl font-black text-[#ffb77d] uppercase tracking-tighter leading-none flex items-center gap-2">
          CHOMP
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-2">
          Vault Security Active
        </p>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1.5 select-none font-mono">
        <Button
          variant="ghost"
          onClick={() => {
            setActiveTab("vault");
            setSelectedGroup("All");
          }}
          className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 rounded-none h-auto ${
            activeTab === "vault"
              ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)] hover:bg-[#4b5320] hover:text-[#bdc787]"
              : "bg-transparent text-muted-foreground hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
          }`}
        >
          <Lock className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Vault Dashboard
          </span>
        </Button>
        {/* Key Generator Tab */}
        <Button
          variant="ghost"
          onClick={() => setActiveTab("generator")}
          className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 rounded-none h-auto ${
            activeTab === "generator"
              ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)] hover:bg-[#4b5320] hover:text-[#bdc787]"
              : "bg-transparent text-muted-foreground hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
          }`}
        >
          <Key className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Generator Forge
          </span>
        </Button>

        {/* Security Tab */}
        <Button
          variant="ghost"
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 rounded-none h-auto ${
            activeTab === "audit"
              ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)] hover:bg-[#4b5320] hover:text-[#bdc787]"
              : "bg-transparent text-muted-foreground hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
          }`}
        >
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Security Sentinel
          </span>
        </Button>

        {/* Settings Tab */}
        <Button
          variant="ghost"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 rounded-none h-auto ${
            activeTab === "settings"
              ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)] hover:bg-[#4b5320] hover:text-[#bdc787]"
              : "bg-transparent text-muted-foreground hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Slab Settings
          </span>
        </Button>

        <div className="mt-6 px-4">
          <p className="text-[10px] uppercase text-muted-foreground/40 mb-2 font-mono tracking-widest">
            LITHIC GROUPS
          </p>
          <div className="flex flex-col gap-0.5">
            {(["Personal", "Work", "Social", "Finance"] as GroupType[]).map(
              (grp) => (
                <Button
                  variant="ghost"
                  key={grp}
                  onClick={() => {
                    setActiveTab("vault");
                    setSelectedGroup(grp);
                  }}
                  className={`flex items-center justify-start gap-3 px-3 py-2 text-left text-xs tracking-wider uppercase transition-colors rounded-sm h-auto ${
                    activeTab === "vault" && selectedGroup === grp
                      ? "text-[#ffb77d] font-bold bg-background hover:bg-background hover:text-[#ffb77d]"
                      : "bg-transparent text-muted-foreground hover:text-[#ffb77d] hover:bg-[#353534]"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8c7b8]" />
                  {grp}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t-2 border-border flex flex-col gap-3">
        <Button
          onClick={onNewSecretClick}
          className="w-full stone-slab hover-ignite text-[#ffb77d] py-3 px-2 flex items-center justify-center gap-1.5 cursor-pointer uppercase font-mono text-[10px] tracking-wider font-bold transition-all"
        >
          <Plus className="w-4 h-4 text-[#ffb77d]" /> Secure New Secret
        </Button>
        <div className="flex flex-col gap-1.5 font-mono text-xs">
          <Button
            variant="ghost"
            onClick={onHelpClick}
            className="flex items-center justify-start gap-3.5 bg-transparent text-muted-foreground hover:text-[#ffb77d] hover:bg-[#353534] px-3 py-1.5 transition-colors text-left h-auto"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="text-[11px] uppercase tracking-wider">
              Vault Help Scroll
            </span>
          </Button>
          <Button
            variant="ghost"
            onClick={onLockClick}
            className="flex items-center justify-start gap-3.5 bg-transparent text-muted-foreground hover:text-[#ffb4ab] hover:bg-[#353534] px-3 py-1.5 transition-colors text-left h-auto"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="text-[11px] uppercase tracking-wider">
              Lock Vault Gate
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
