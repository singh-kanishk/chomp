import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, UserCheck } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function LockScreen() {
  const { isLocked, setIsLocked } = useDashboardStore();
  const [masterPasswordInput, setMasterPasswordInput] = useState("");
  const [lockError, setLockError] = useState(false);

  const onUnlock = () => setIsLocked(false);
  const handleUnlockCavern = (e: React.FormEvent) => {
    e.preventDefault();
    const lowerInput = masterPasswordInput.toLowerCase();

    if (lowerInput === "chomp") {
      setLockError(false);
      setMasterPasswordInput("");
      onUnlock();
    } else {
      setLockError(true);
      setTimeout(() => setLockError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4 select-none cave-bg"
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
            <div className="absolute top-2 left-2 text-[9px] font-mono text-muted-foreground/20 tracking-widest">
              GATE_PORT_3000
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#2a2a2a] border-2 border-[#ffb77d] flex items-center justify-center text-[#ffb77d] shadow-[0_0_15px_rgba(255,183,125,0.3)] animate-pulse mb-3">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="font-headline text-3xl font-black text-[#ffb77d] uppercase tracking-tighter">
                CHOMP VAULT
              </h1>
              <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mt-1">
                Fortress Security Engaged
              </p>
            </div>

            <form onSubmit={handleUnlockCavern} className="space-y-4 pt-2">
              <div>
                <label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest text-left mb-1.5 justify-center flex gap-1">
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
                  className="w-full bg-input border-2 border-border focus:border-[#ffb77d] px-4 py-3 text-center text-[#ffb77d] font-mono text-sm tracking-widest placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-[#ffb77d] transition-all caret-[#ffb77d]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4b5320] border-2 border-[#c3cc8c] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] py-3.5 font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" /> Unlock Cavern Gates
              </button>
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

            <p className="text-[10px] font-mono text-muted-foreground/40 leading-relaxed uppercase">
              Protected by 256-bit volcanic lithic-stone encryption walls.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
