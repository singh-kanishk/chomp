import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Key,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  User,
  Plus,
  FileText,
  UserCheck,
  Flame,
  Check,
  RotateCw,
} from "lucide-react";

import type { Credential, TabType, GroupType } from "./schemas/schema";
import { INITIAL_CREDENTIALS } from "./initialData";
import VaultView from "./components/VaultView";
import GeneratorView from "./components/GeneratorView";
import SecurityAuditView from "./components/SecurityAuditView";
import SettingsView from "./components/SettingsView";
import PortalModal from "./components/PortalModal";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  // State configuration with localStorage persistence
  const [credentials, setCredentials] = useState<Credential[]>(() => {
    const saved = localStorage.getItem("chomp_vault_secrets");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved credentials, using defaults", e);
      }
    }
    return INITIAL_CREDENTIALS;
  });

  const [activeTab, setActiveTab] = useState<TabType>("vault");
  const [selectedGroup, setSelectedGroup] = useState<GroupType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Locking states
  const [isLocked, setIsLocked] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState("");
  const [lockError, setLockError] = useState(false);

  // Custom themed overlay notifications and confirmations
  const [customPrompt, setCustomPrompt] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "confirm";
    onConfirm?: () => void;
  } | null>(null);

  // Modal actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(
    null,
  );

  // Help drawer
  const [showHelp, setShowHelp] = useState(false);

  // Sync client state store with local storage
  useEffect(() => {
    localStorage.setItem("chomp_vault_secrets", JSON.stringify(credentials));
  }, [credentials]);

  // Create new or Modify previous secret
  const handleSaveCredential = (
    newData: Omit<Credential, "id" | "strength">,
  ) => {
    const analyzeStrength = (pass: string): "Strong" | "Medium" | "Weak" => {
      if (pass.length < 6) return "Weak";
      const hasUpperCase = /[A-Z]/.test(pass);
      const hasLowerCase = /[a-z]/.test(pass);
      const hasNumbers = /\d/.test(pass);
      const hasNonalphas = /\W/.test(pass);
      const count = [
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasNonalphas,
      ].filter(Boolean).length;

      if (pass.length >= 12 && count >= 3) return "Strong";
      if (pass.length >= 8 && count >= 2) return "Medium";
      return "Weak";
    };

    const newStrength = analyzeStrength(newData.password);
    const currentDate = new Date().toISOString().split("T")[0];

    if (editingCredential) {
      // Modify
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === editingCredential.id
            ? {
                ...c,
                ...newData,
                strength: newStrength,
                lastUpdated: currentDate,
              }
            : c,
        ),
      );
      setEditingCredential(null);
    } else {
      // Create new
      const newCred: Credential = {
        ...newData,
        id: Math.random().toString(36).substring(2, 9),
        strength: newStrength,
        lastUpdated: currentDate,
        isFavorite: false,
      };
      setCredentials((prev) => [newCred, ...prev]);
    }
  };

  // Quick vault deposit from generator
  const handleQuickVaultDeposit = (generatedPassword: string) => {
    const defaultData: Omit<Credential, "id" | "strength"> = {
      name: "Unassigned Forge",
      username: "user_handle",
      password: generatedPassword,
      group: "Personal",
      websiteUrl: "",
      notes: "Slab key forged inside Primitive Key Generator.",
    };
    handleSaveCredential(defaultData);
    setActiveTab("vault");
    setSelectedGroup("All");
    setSearchQuery("Forge");
  };

  // Upgrade password from security auditor
  const handleUpgradePassword = (id: string, newPassword: string) => {
    setCredentials((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            password: newPassword,
            strength: "Strong",
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return c;
      }),
    );
  };

  // Delete credentials
  const handleDeleteCredential = (id: string) => {
    setCustomPrompt({
      isOpen: true,
      title: "TECTONIC PURGE COMMENCEMENT",
      message:
        "Are you absolutely sure you want to purge this secure runestone key forever? This operation is completely irreversible.",
      type: "confirm",
      onConfirm: () => {
        setCredentials((prev) => prev.filter((c) => c.id !== id));
      },
    });
  };

  // Maintenance triggers
  const handleClearVault = () => {
    setCustomPrompt({
      isOpen: true,
      title: "TECTONIC EXTINCTION COMMAND",
      message:
        "WARNING: This will completely destroy every single password element locked inside the stone walls. Continued action is irreversible.",
      type: "confirm",
      onConfirm: () => {
        setCredentials([]);
      },
    });
  };

  const handleResetToDefaults = () => {
    setCustomPrompt({
      isOpen: true,
      title: "LITHIC REINITIALIZATION",
      message:
        "This will wipe your current secrets and reinstall the initial default mock slate. Proceed?",
      type: "confirm",
      onConfirm: () => {
        setCredentials(INITIAL_CREDENTIALS);
      },
    });
  };

  const handleImportBackup = (imported: Credential[]) => {
    setCredentials((prev) => [...imported, ...prev]);
  };

  const getExportString = () => {
    return JSON.stringify(credentials, null, 2);
  };

  // Unlock credentials check
  const handleUnlockCavern = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      masterPasswordInput === "chomp" ||
      masterPasswordInput === "CHOMP" ||
      masterPasswordInput.toLowerCase() === "chomp"
    ) {
      setIsLocked(false);
      setLockError(false);
      setMasterPasswordInput("");
    } else {
      setLockError(true);
      setTimeout(() => setLockError(false), 2000);
    }
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] cave-bg min-h-screen flex selection:bg-[#ffb77d] selection:text-[#131313]">
      {/* 1. LOCK SCREEN tomb overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#131313] flex flex-col items-center justify-center p-4 select-none cave-bg"
          >
            {/* Runes matrix in background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,183,125,0.15) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="stone-slab max-w-md w-full p-8 border-4 border-[#ffb77d]/30 text-center space-y-6 relative"
            >
              <div className="absolute top-2 left-2 text-[9px] font-mono text-[#c8c7b8]/20 tracking-widest">
                GATE_PORT_3000
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#2a2a2a] border-2 border-[#ffb77d] flex items-center justify-center text-[#ffb77d] shadow-[0_0_15px_rgba(255,183,125,0.3)] animate-pulse mb-3">
                  <Lock className="w-8 h-8" />
                </div>
                <h1 className="font-headline text-3xl font-black text-[#ffb77d] uppercase tracking-tighter">
                  CHOMP VAULT
                </h1>
                <p className="font-mono text-xs text-[#c8c7b8]/60 uppercase tracking-widest mt-1">
                  Fortress Security Engaged
                </p>
              </div>

              <form onSubmit={handleUnlockCavern} className="space-y-4 pt-2">
                <div>
                  <label className="block font-mono text-[10px] text-[#c8c7b8] uppercase tracking-widest text-left mb-1.5 justify-center flex gap-1">
                    Enter master passcode to release seal{" "}
                    <span className="text-[#ffb77d] font-bold">
                      (Hint: 'chomp')
                    </span>
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Provide gate key..."
                    value={masterPasswordInput}
                    onChange={(e) => setMasterPasswordInput(e.target.value)}
                    className="w-full bg-[#0e0e0e] border-2 border-[#47483c] focus:border-[#ffb77d] px-4 py-3 text-center text-[#ffb77d] font-mono text-sm tracking-widest placeholder:text-[#c8c7b8]/35 focus:outline-none focus:ring-1 focus:ring-[#ffb77d] transition-all caret-[#ffb77d]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#4b5320] border-2 border-[#c3cc8c] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] py-3.5 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" /> Unlock Cavern Gates
                </Button>
              </form>

              {lockError && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-mono text-xs text-[#ffb4ab] uppercase tracking-wider font-bold"
                >
                  ⚠️ INCORRECT PATH CODE RUNES. CHOMP DENIES ACCESS.
                </motion.p>
              )}

              <p className="text-[10px] font-mono text-[#c8c7b8]/40 leading-relaxed uppercase">
                Protected by 256-bit volcanic lithic-stone encryption walls.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN SYSTEM CORE */}
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-screen w-64 bg-[#2a2a2a] border-r-4 border-[#353534] shadow-[5px_0_0_0_rgba(0,0,0,0.3)] flex flex-col z-40">
        {/* Brand header */}
        <div className="p-6 border-b-2 border-[#47483c] select-none">
          <h1 className="font-headline text-3xl font-black text-[#ffb77d] uppercase tracking-tighter leading-none flex items-center gap-2">
            CHOMP
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#c8c7b8]/60 mt-2">
            Vault Security Active
          </p>
        </div>

        {/* Navigation panel Links */}
        <div className="flex-1 py-6 flex flex-col gap-1.5 select-none font-mono">
          {/* Vault Tab */}
          <Button
            onClick={() => {
              setActiveTab("vault");
              setSelectedGroup("All");
            }}
            className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 ${
              activeTab === "vault"
                ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)]"
                : "text-[#c8c7b8] hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
            }`}
          >
            <Lock className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Vault Dashboard
            </span>
          </Button>

          {/* Key Generator Tab */}
          <Button
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 ${
              activeTab === "generator"
                ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)]"
                : "text-[#c8c7b8] hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
            }`}
          >
            <Key className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Generator Forge
            </span>
          </Button>

          {/* Security Tab */}
          <Button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 ${
              activeTab === "audit"
                ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)]"
                : "text-[#c8c7b8] hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
            }`}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Security Sentinel
            </span>
          </Button>

          {/* Settings Tab */}
          <Button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-4 px-4 py-3 text-left transition-all relative border-r-2 ${
              activeTab === "settings"
                ? "bg-[#4b5320] text-[#bdc787] border-[#c3cc8c] shadow-[0_0_15px_rgba(195,204,140,0.25)]"
                : "text-[#c8c7b8] hover:text-[#ffb77d] hover:bg-[#353534] border-transparent"
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Slab Settings
            </span>
          </Button>

          {/* Sidebar Category Links */}
          <div className="mt-6 px-4">
            <p className="text-[10px] uppercase text-[#c8c7b8]/40 mb-2 font-mono tracking-widest">
              LITHIC GROUPS
            </p>
            <div className="flex flex-col gap-0.5">
              {(["Personal", "Work", "Social", "Finance"] as GroupType[]).map(
                (grp) => (
                  <Button
                    key={grp}
                    onClick={() => {
                      setActiveTab("vault");
                      setSelectedGroup(grp);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 text-left text-xs tracking-wider uppercase transition-colors rounded-sm ${
                      activeTab === "vault" && selectedGroup === grp
                        ? "text-[#ffb77d] font-bold bg-[#131313]"
                        : "text-[#c8c7b8] hover:text-[#ffb77d] hover:bg-[#353534]"
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

        {/* Sidebar Footer Controls */}
        <div className="p-6 border-t-2 border-[#47483c] flex flex-col gap-3">
          <Button
            onClick={() => {
              setEditingCredential(null);
              setIsModalOpen(true);
            }}
            className="w-full stone-slab hover-ignite text-[#ffb77d] py-3 px-2 flex items-center justify-center gap-1.5 cursor-pointer uppercase font-mono text-[10px] tracking-wider font-bold transition-all"
            id="sidebar-new-secret-btn"
          >
            <Plus className="w-4 h-4 text-[#ffb77d]" />
            Secure New Secret
          </Button>

          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <Button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-3.5 text-[#c8c7b8] hover:text-[#ffb77d] px-3 py-1.5 transition-colors text-left"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="text-[11px] uppercase tracking-wider">
                Vault Help Scroll
              </span>
            </Button>
            <Button
              onClick={() => setIsLocked(true)}
              className="flex items-center gap-3.5 text-[#c8c7b8] hover:text-[#ffb4ab] px-3 py-1.5 transition-colors text-left"
              id="sidebar-lock-vault-btn"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="text-[11px] uppercase tracking-wider">
                Lock Vault Gate
              </span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Container Area */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top App Bar Custom Navigation */}
        <header className="flex justify-between items-center px-8 md:px-16 h-20 border-b-2 border-[#47483c] bg-[#131313] sticky top-0 z-30 select-none">
          {/* Top Search bar */}
          <div className="flex items-center gap-3 text-[#c8c7b8]">
            <Search className="w-5 h-5 text-[#c8c7b8]/60" />
            <input
              type="text"
              placeholder="Search through secure slabs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== "vault") setActiveTab("vault");
              }}
              className="bg-transparent border-none text-sm font-mono focus:ring-0 focus:outline-none placeholder-on-surface-variant w-64 text-[#e5e2e1]"
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-1 bg-[#1c1b1b] border border-[#47483c] px-3 py-1 text-[11px] font-mono text-[#c8c7b8]">
              🛡️ GATEWAY:{" "}
              <span className="text-[#c3cc8c] font-bold">PORT 3000 ACTIVE</span>
            </div>

            <Button
              onClick={() =>
                setCustomPrompt({
                  isOpen: true,
                  title: "Sentinel System Update",
                  message: `No current warnings detected inside volcanic encryption walls. Core Security Audit health score is active. All encryption ports are active and guarded.`,
                  type: "info",
                })
              }
              className="p-1 border border-[#47483c] bg-[#1c1b1b] text-[#c8c7b8] hover:text-[#ffb77d] hover:border-[#ffb77d] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffb77d] rounded-full shadow-[0_0_5px_#ffb77d]" />
            </Button>

            <Button
              onClick={() =>
                setCustomPrompt({
                  isOpen: true,
                  title: "Vault Operator Signet",
                  message:
                    "CHOMP Profile Identity:\nEmail: Kanishksingh06102004@gmail.com\nRole: Primary Volcanic Vault Operator\nPrivilege: Full Fortress Vault Admin",
                  type: "info",
                })
              }
              className="flex items-center gap-2 border border-[#47483c] bg-[#1c1b1b] pl-2 pr-3 py-1 text-xs font-mono text-[#c8c7b8] hover:border-[#ffb77d]"
            >
              <User className="w-3.5 h-3.5" />
              <span>Operator</span>
            </Button>

            <Button
              onClick={() => {
                setEditingCredential(null);
                setIsModalOpen(true);
              }}
              className="bg-[#4b5320] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] px-4 py-2 font-mono text-[11px] uppercase tracking-widest border border-[#c3cc8c] transition-colors font-bold shadow-[0_0_8px_rgba(195,204,140,0.15)] flex items-center gap-1 cursor-pointer"
              id="topbar-add-password-btn"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Add Password</span>
            </Button>
          </div>
        </header>

        {/* Main Content Dashboard Canvas */}
        <main className="p-8 md:p-16 max-w-[1250px] mx-auto w-full relative flex-1">
          {/* Guardian Monster background watermark image requested by mock design */}
          <img
            alt="Muscle Monster Guardian and Sentinel"
            className="fixed bottom-0 right-0 h-[480px] object-contain opacity-[0.06] md:opacity-[0.13] pointer-events-none z-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZQ9SwMUpKvDw3LqhzZUu2kADFSvnxGx9R8WPvb0okAat2htWpcPs3qMdHgsxUNwDZe6SWx7X7BXiZCqNejFqg1X6VflZL6H83k9vwg1Guf-hFAUN9rfKFdF3X8CtqgA1Q6LMyAjiYWMj1BaJ-ZNpP7C6eWJ-u2XhutySaxheJc26A0s_zSY7W0eygB4nABEnVtYgiC712PyhBc7bIlV5-t6UGw_DB_BowZUq4X6iPDB9XrIgLxQwJlZcQYAjtvYjS5TvdSkj1QBw2"
            style={{
              mixBlendMode: "screen",
              filter:
                "grayscale(100%) sepia(100%) hue-rotate(35deg) saturate(350%) brightness(0.65)",
            }}
          />

          {/* Interactive Screen Tab Router switcher */}
          <div className="relative z-10">
            {activeTab === "vault" && (
              <VaultView
                credentials={credentials}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                selectedGroup={selectedGroup}
                onSelectGroup={setSelectedGroup}
                onAddPasswordClick={() => {
                  setEditingCredential(null);
                  setIsModalOpen(true);
                }}
                onEditPasswordClick={(cred) => {
                  setEditingCredential(cred);
                  setIsModalOpen(true);
                }}
                onDeletePasswordClick={handleDeleteCredential}
              />
            )}

            {activeTab === "generator" && (
              <GeneratorView onAddSecurely={handleQuickVaultDeposit} />
            )}

            {activeTab === "audit" && (
              <SecurityAuditView
                credentials={credentials}
                onUpgradePassword={handleUpgradePassword}
              />
            )}

            {activeTab === "settings" && (
              <SettingsView
                onClearVault={handleClearVault}
                onResetToDefaults={handleResetToDefaults}
                onImportBackup={handleImportBackup}
                exportCredentials={getExportString}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button bottom right of screen */}
      <Button
        onClick={() => {
          setEditingCredential(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-10 right-10 w-14 h-14 rounded-full torch-fab flex items-center justify-center z-40 group cursor-pointer"
        id="floating-add-btn"
      >
        <Plus className="w-7 h-7 text-[#131313] transition-transform duration-300 group-hover:rotate-90" />

        {/* Hover Tooltip trigger */}
        <span className="absolute right-16 bg-[#2a2a2a] border border-[#ffb77d] text-[#ffb77d] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
          Forge New Crypt
        </span>
      </Button>

      {/* Create / Edit Secrets Dialog Overlay */}
      <PortalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCredential(null);
        }}
        onSave={handleSaveCredential}
        editingCredential={editingCredential}
      />

      {/* Help Modal screen overlay */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="stone-slab border-4 border-[#ffb77d]/40 max-w-md w-full p-6 relative font-mono text-xs select-none"
            >
              <h3 className="font-headline text-lg text-[#ffb77d] mb-4 uppercase tracking-wider">
                📜 Vault Hieroglyph Scrolls
              </h3>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <h4 className="text-[#c3cc8c] font-bold">
                    🛠️ Forge Dynamic Credentials
                  </h4>
                  <p className="text-[#c8c7b8] leading-relaxed text-[11px]">
                    Build strong credentials inside the{" "}
                    <strong>Generator tab</strong>. Use the length slider to
                    increase entropy up to 32 characters.
                  </p>
                </div>
                <div className="space-y-1 border-t border-[#47483c]/30 pt-3">
                  <h4 className="text-[#c3cc8c] font-bold">
                    🔍 Sentinel Real-time Auditor
                  </h4>
                  <p className="text-[#c8c7b8] leading-relaxed text-[11px]">
                    The <strong>Security Audit tab</strong> dynamically queries
                    duplicates/reused characters and weak passwords. Click{" "}
                    <strong>Auto-Chomp</strong> to trigger automated
                    cryptographic replacements!
                  </p>
                </div>
                <div className="space-y-1 border-t border-[#47483c]/30 pt-3">
                  <h4 className="text-[#c3cc8c] font-bold">
                    🗝️ Master Vault Gateway Code
                  </h4>
                  <p className="text-[#c8c7b8] leading-relaxed text-[11px]">
                    Locking the vault will trigger code security gates. Open
                    lock entries using passcode: <strong>chomp</strong>.
                  </p>
                </div>
                <div className="space-y-1 border-t border-[#47483c]/30 pt-3">
                  <h4 className="text-[#c8c7b8]/40 text-[9px] leading-relaxed">
                    CHOMP VAULT SYSTEM RUNNING SECURELY ON CLOUD RUN PORT 3000
                    WITH NODE ENVIRONMENT IN VITE WORKSPACE.
                  </h4>
                </div>
              </div>
              <Button
                onClick={() => setShowHelp(false)}
                className="w-full mt-5 bg-[#4b5320] border border-[#c3cc8c] text-[#bdc787] py-2 uppercase font-bold tracking-wider hover:bg-[#c3cc8c] hover:text-[#2d3404] transition-all cursor-pointer text-center"
              >
                Close Scroll
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Alert & Confirms Dialogue overlay */}
      <AnimatePresence>
        {customPrompt?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomPrompt(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="stone-slab border-4 border-[#ffb77d]/50 max-w-sm w-full p-6 relative font-mono text-xs text-[#e5e2e1]"
            >
              {/* Highlight bar header */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffb77d]" />

              <h3 className="font-headline text-sm text-[#ffb77d] uppercase tracking-wider mb-3">
                🔱 {customPrompt.title}
              </h3>

              <div className="bg-[#0e0e0e] border border-[#47483c] p-3 text-xs text-[#c8c7b8] leading-relaxed rounded-xs whitespace-pre-line mb-5">
                {customPrompt.message}
              </div>

              <div className="flex gap-3 justify-end">
                {customPrompt.type === "confirm" ? (
                  <>
                    <Button
                      onClick={() => setCustomPrompt(null)}
                      className="px-4 py-2 border border-[#47483c] bg-[#1c1b1b] text-[#c8c7b8] hover:text-[#ffb77d] hover:border-[#ffb77d] uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                    >
                      Bypass
                    </Button>
                    <Button
                      onClick={() => {
                        if (customPrompt.onConfirm) customPrompt.onConfirm();
                        setCustomPrompt(null);
                      }}
                      className="px-5 py-2 bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#131313] uppercase text-[10px] tracking-wider transition-all font-bold cursor-pointer"
                    >
                      EXECUTE HAMMER
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setCustomPrompt(null)}
                    className="px-5 py-2 bg-[#4b5320] border border-[#c3cc8c] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] uppercase text-[10px] tracking-wider transition-all font-bold cursor-pointer"
                  >
                    RESOLVE runes
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
