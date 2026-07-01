import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings,
  Save,
  Trash2,
  ShieldAlert,
  Check,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVaultStore } from "@/store/useVaultStore";
import type { CredentialFrontend } from "@chomp/shared";

export default function SettingsView() {
  const { clearVault, importBackup, getExportString } =
    useVaultStore();

  const onClearVault = () => clearVault();
  const onImportBackup = (imported: CredentialFrontend[]) => importBackup(imported);
  const exportCredentials = () => getExportString();

  const [masterKey, setMasterKey] = useState("CHOMP_MASTER_GUARD_2026!");
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [bioluminescent, setBioluminescent] = useState(true);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importDone, setImportDone] = useState(false);

  const handleSaveMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDownloadBackup = () => {
    const dataStr = exportCredentials();
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "chomp_vault_lithic_backup.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJSON = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed))
        throw new Error("Backup must be an array of password secrets!");
      const isValid = parsed.every(
        (item) => item.name && item.username && item.password && item.group,
      );
      if (!isValid) throw new Error("Invalid secret format inside the arrays!");

      onImportBackup(parsed);
      setImportDone(true);
      setImportText("");
      setTimeout(() => setImportDone(false), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "JSON Parsing failed!";
      setImportError(message);
    }
  };

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#2a2a2a] border-2 border-[#ffb77d] px-4 py-3 shadow-[0_0_15px_rgba(255,183,125,0.4)] flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-[#ffb77d]/20 border border-[#ffb77d] flex items-center justify-center text-[#ffb77d]">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-mono text-xs text-[#e5e2e1] uppercase tracking-wider font-bold">
                MASTER SEAL CONFIGURED!
              </p>
              <p className="font-mono text-[10px] text-[#c8c7b8] mt-0.5">
                New master sentinel gate passcode is securely set.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 border-b-2 border-[#47483c] pb-4">
        <Settings className="w-7 h-7 text-[#ffb77d]" />
        <div>
          <h2 className="font-headline text-2xl text-[#ffb77d] uppercase tracking-wider">
            Sentinel Vault Settings
          </h2>
          <p className="font-mono text-xs text-[#c8c7b8]/60 uppercase tracking-widest mt-1">
            Reconfigure slab master parameters, export stones backup, or purge
            cells
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="stone-slab p-6 border-2 border-[#47483c] flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-headline text-base text-[#e5e2e1] uppercase tracking-wider mb-2">
              Master Fortress Seal
            </h3>
            <p className="font-mono text-[11px] text-[#c8c7b8]/60 leading-relaxed uppercase">
              The primary key that protects the password vault on start. Do not
              lose this.
            </p>
          </div>

          <form
            onSubmit={handleSaveMasterKey}
            className="space-y-4 font-mono text-xs flex-1 flex flex-col justify-end"
          >
            <div>
              <label className="block text-[10px] uppercase text-[#c8c7b8] mb-1 tracking-wider">
                Fortress Access Passphrase
              </label>
              <Input
                type={showKey ? "text" : "password"}
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                className="bg-[#0e0e0e] border-[#47483c] text-[#ffb77d] focus:border-[#ffb77d] h-10 select-all rounded-none"
              />
            </div>

            <div className="flex items-center gap-3 py-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowKey(!showKey)}
                className="h-8 text-[10px] uppercase bg-transparent border-[#47483c] hover:border-[#ffb77d] text-[#c8c7b8] hover:text-[#ffb77d] hover:bg-transparent rounded-none"
              >
                {showKey ? "Hide Secrecy" : "Reveal Secrecy"}
              </Button>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={bioluminescent}
                  onChange={() => setBioluminescent(!bioluminescent)}
                  className="rounded-none bg-[#0e0e0e] border-[#47483c] accent-[#ffb77d]"
                />
                <span className="text-[10px] uppercase text-[#c8c7b8]">
                  Glow Hover Effects
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-[#4b5320] border border-[#c3cc8c] hover:bg-[#c3cc8c] hover:text-[#2d3404] text-[#bdc787] font-bold uppercase tracking-wider transition-all shadow-[0_0_8px_rgba(195,204,140,0.1)] gap-1.5 rounded-none"
            >
              <Save className="w-4 h-4" /> Save Fortress Key
            </Button>
          </form>
        </div>

        <div className="stone-slab p-6 border-2 border-[#47483c] flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-headline text-base text-[#e5e2e1] uppercase tracking-wider mb-2">
              Runestone Exports & Backups
            </h3>
            <p className="font-mono text-[11px] text-[#c8c7b8]/60 leading-relaxed uppercase">
              Retrieve full copies of your local database secrets or import
              runic blueprints directly.
            </p>
          </div>

          <div className="space-y-3 pt-4 font-mono text-xs flex-1 flex flex-col justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadBackup}
              className="w-full h-10 bg-[#201f1f] border-[#47483c] hover:border-[#ffb77d] text-[#e5e2e1] hover:text-[#ffb77d] hover:bg-[#201f1f] font-bold uppercase tracking-wider transition-all gap-1.5 rounded-none"
            >
              <Download className="w-4 h-4" /> Export Backup file
            </Button>

            <div className="bg-[#131313] border border-[#47483c] p-3 space-y-2">
              <span className="text-[10px] uppercase text-[#c8c7b8] tracking-wider block">
                Import JSON Runes
              </span>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON array backup string..."
                rows={2}
                className="w-full bg-[#0e0e0e] border border-[#47483c] px-2 py-1.5 text-[11px] font-mono text-[#ffb77d] focus:outline-none focus:border-[#ffb77d] resize-none outline-none"
              />
              {importError && (
                <p className="text-[#ffb4ab] text-[10px] font-mono uppercase tracking-wide">
                  Error: {importError}
                </p>
              )}
              {importDone && (
                <p className="text-[#c3cc8c] text-[10px] font-mono uppercase tracking-wide">
                  Import completed successfully!
                </p>
              )}
              <Button
                type="button"
                onClick={handleImportJSON}
                disabled={!importText}
                className="w-full h-8 bg-[#4b5320] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] disabled:bg-[#1c1b1b] disabled:text-[#47483c] uppercase font-mono text-[10px] tracking-wider border border-[#c3cc8c]/40 rounded-none"
              >
                Assemble JSON Secrets
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="stone-slab p-6 border-4 border-[#ffb4ab]/30 bg-[#93000a]/5 space-y-4">
        <div className="flex items-center gap-2.5 text-[#ffb4ab]">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <h3 className="font-headline text-base uppercase tracking-wider">
            Tectonic Destruction Vault Panel
          </h3>
        </div>

        <p className="font-body text-xs text-[#c8c7b8] max-w-3xl leading-relaxed">
          These operations immediately modify local vault storage matrices. They
          are completely irreversible. Be absolutely sure before triggering
          hammer of destruction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button
            type="button"
            variant="destructive"
            onClick={onClearVault}
            className="flex-1 h-10 bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#131313] font-mono text-xs uppercase tracking-wider font-bold transition-all gap-1.5 shadow-sm hover:shadow-[0_0_10px_rgba(255,180,171,0.25)] rounded-none"
          >
            <Trash2 className="w-4 h-4" /> PURGE ALL VAULT SECRETS
          </Button>
        </div>
      </section>
    </div>
  );
}
