import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { useVaultData } from "./hooks/useVaultData";
import { useVaultUIStore } from "@/store/useVaultUiStore";
import { VaultOverview } from "./components/VaultOverview";
import { QuickAccess } from "./components/QuickAccess";
import { VaultControls } from "./components/VaultControls";
import { VaultTable } from "./components/VaultTable";

export default function VaultView() {
  const { credentials, securityScore } = useVaultData();
  const copiedState = useVaultUIStore((state) => state.copiedState);

  return (
    <div className="space-y-10 select-none">
      <AnimatePresence>
        {copiedState && (
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
              <p className="font-mono text-xs text-[#e5e2e1] uppercase tracking-wider">
                Hieroglyph Transcribed!
              </p>
              <p className="font-mono text-[10px] text-[#c8c7b8] mt-0.5">
                Copied {copiedState.type} to local scroll board.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VaultOverview
        totalCrypts={credentials.length}
        strongSeals={credentials.filter((c) => c.strength === "Strong").length}
        securityScore={securityScore}
      />

      <QuickAccess />

      <section className="space-y-4">
        <VaultControls />
        <VaultTable />
      </section>
    </div>
  );
}
