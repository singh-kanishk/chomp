import { useState } from "react";
import type { Credential, TabType, GroupType } from "./schemas/schema";
import { useVault } from "@/hooks/useVault";

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

export type CustomPromptState = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "confirm";
  onConfirm?: () => void;
};

export function Dashboard() {
  const vault = useVault();

  // Local UI State
  const [activeTab, setActiveTab] = useState<TabType>("vault");
  const [selectedGroup, setSelectedGroup] = useState<GroupType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(
    null,
  );
  const [showHelp, setShowHelp] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<CustomPromptState | null>(
    null,
  );

  const openCredentialModal = (cred: Credential | null = null) => {
    setEditingCredential(cred);
    setIsModalOpen(true);
  };

  const handleQuickVaultDeposit = (generatedPassword: string) => {
    vault.handleSaveCredential({
      name: "Unassigned Forge",
      username: "user_handle",
      password: generatedPassword,
      group: "Personal",
      websiteUrl: "",
      notes: "Slab key forged inside Primitive Key Generator.",
    });
    setActiveTab("vault");
    setSelectedGroup("All");
    setSearchQuery("Forge");
  };

  const handleDeleteRequest = (id: string) => {
    setCustomPrompt({
      isOpen: true,
      title: "TECTONIC PURGE COMMENCEMENT",
      message:
        "Are you absolutely sure you want to purge this secure runestone key forever? This operation is completely irreversible.",
      type: "confirm",
      onConfirm: () => vault.deleteCredential(id),
    });
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] cave-bg min-h-screen flex selection:bg-[#ffb77d] selection:text-[#131313]">
      <LockScreen isLocked={isLocked} onUnlock={() => setIsLocked(false)} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        onNewSecretClick={() => openCredentialModal()}
        onHelpClick={() => setShowHelp(true)}
        onLockClick={() => setIsLocked(true)}
      />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            if (activeTab !== "vault") setActiveTab("vault");
          }}
          onAddPasswordClick={() => openCredentialModal()}
          onNotificationClick={() =>
            setCustomPrompt({
              isOpen: true,
              title: "Sentinel System Update",
              message: "Core Security Audit health score is active.",
              type: "info",
            })
          }
          onProfileClick={() =>
            setCustomPrompt({
              isOpen: true,
              title: "Vault Operator Signet",
              message: "Role: Primary Volcanic Vault Operator",
              type: "info",
            })
          }
        />

        <main className="p-8 md:p-16 max-w-[1250px] mx-auto w-full relative flex-1">
          {/* Re-integrated the missing background watermark */}
          <BackgroundWatermark />

          <div className="relative z-10">
            {activeTab === "vault" && (
              <VaultView
                credentials={vault.credentials}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                selectedGroup={selectedGroup}
                onSelectGroup={setSelectedGroup}
                onAddPasswordClick={() => openCredentialModal()}
                onEditPasswordClick={openCredentialModal}
                onDeletePasswordClick={handleDeleteRequest}
              />
            )}
            {activeTab === "generator" && (
              <GeneratorView onAddSecurely={handleQuickVaultDeposit} />
            )}
            {activeTab === "audit" && (
              <SecurityAuditView
                credentials={vault.credentials}
                onUpgradePassword={vault.handleUpgradePassword}
              />
            )}
            {activeTab === "settings" && (
              <SettingsView
                onClearVault={() => vault.handleClearVault()}
                onResetToDefaults={() => vault.handleResetToDefaults()}
                onImportBackup={vault.handleImportBackup}
                exportCredentials={vault.getExportString}
              />
            )}
          </div>
        </main>
      </div>

      <Fab onClick={() => openCredentialModal()} />

      <PortalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCredential(null);
        }}
        onSave={(data) => {
          vault.handleSaveCredential(data, editingCredential?.id);
          setIsModalOpen(false);
        }}
        editingCredential={editingCredential}
      />

      <HelpScroll isOpen={showHelp} onClose={() => setShowHelp(false)} />

      <CustomPrompt
        config={customPrompt}
        onClose={() => setCustomPrompt(null)}
      />
    </div>
  );
}
