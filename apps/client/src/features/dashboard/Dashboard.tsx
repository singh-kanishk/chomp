import { useDashboardStore } from "@/store/useDashboardStore";

// Layout & UI
import { Sidebar } from "./components/layout/SideBar";
import { Topbar } from "./components/layout/Topbar";
import { Fab } from "./components/ui/Fab";
import { BackgroundWatermark } from "./components/layout/BackGroundWatermark";

// Views
import VaultView from "./components/VaultView";
import GeneratorView from "./components/GeneratorView";
import SecurityAuditView from "./components/SecurityAuditView";
import SettingsView from "./components/SettingsView";

// Modals
import PortalModal from "./components/PortalModal";
import { LockScreen } from "./components/modals/LockScreen";
import { HelpScroll } from "./components/modals/HelpScroll";
import { CustomPrompt } from "./components/modals/CustomPrompt";

export function Dashboard() {
  const dashboard = useDashboardStore();

  return (
    <div className="bg-[#131313] text-[#e5e2e1] cave-bg min-h-screen flex selection:bg-[#ffb77d] selection:text-[#131313]">
      <LockScreen />

      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Topbar />

        <main className="p-8 md:p-16 max-w-[1250px] mx-auto w-full relative flex-1">
          <BackgroundWatermark />

          <div className="relative z-10">
            {dashboard.activeTab === "vault" && <VaultView />}
            {dashboard.activeTab === "generator" && <GeneratorView />}
            {dashboard.activeTab === "audit" && <SecurityAuditView />}
            {dashboard.activeTab === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

      <Fab />

      <PortalModal />

      <HelpScroll />

      <CustomPrompt />
    </div>
  );
}
