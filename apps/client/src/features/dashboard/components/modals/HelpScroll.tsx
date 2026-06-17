import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";

export function HelpScroll() {
  const { showHelp, setShowHelp } = useDashboardStore();
  const onClose = () => setShowHelp(false);
  return (
    <AnimatePresence>
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  <strong>Auto-Chomp</strong> to trigger automated cryptographic
                  replacements!
                </p>
              </div>
              <div className="space-y-1 border-t border-[#47483c]/30 pt-3">
                <h4 className="text-[#c3cc8c] font-bold">
                  🗝️ Master Vault Gateway Code
                </h4>
                <p className="text-[#c8c7b8] leading-relaxed text-[11px]">
                  Locking the vault will trigger code security gates. Open lock
                  entries using passcode: <strong>chomp</strong>.
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
              onClick={onClose}
              className="w-full mt-5 bg-[#4b5320] border border-[#c3cc8c] text-[#bdc787] py-2 uppercase font-bold tracking-wider hover:bg-[#c3cc8c] hover:text-[#2d3404] transition-all cursor-pointer text-center"
            >
              Close Scroll
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
