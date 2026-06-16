import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Check,
  RefreshCw,
  Sparkles,
  Key,
  ChevronRight,
} from "lucide-react";
import type { Credential } from "../schemas/schema";

interface SecurityAuditProps {
  credentials: Credential[];
  onUpgradePassword: (id: string, newPass: string) => void;
}

export default function SecurityAuditView({
  credentials,
  onUpgradePassword,
}: SecurityAuditProps) {
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  // Analyze credentials
  const total = credentials.length;
  const strong = credentials.filter((c) => c.strength === "Strong");
  const medium = credentials.filter((c) => c.strength === "Medium");
  const weak = credentials.filter((c) => c.strength === "Weak");

  // Find duplicated passwords
  const passwordCounts: { [key: string]: string[] } = {};
  credentials.forEach((c) => {
    if (!passwordCounts[c.password]) {
      passwordCounts[c.password] = [];
    }
    passwordCounts[c.password].push(c.name);
  });

  const duplicates = Object.keys(passwordCounts)
    .filter((p) => passwordCounts[p].length > 1)
    .map((p) => ({
      password: p,
      apps: passwordCounts[p],
    }));

  // Calculate dynamic security score
  const score =
    total > 0
      ? Math.round(
          (strong.length * 100 + medium.length * 50 + weak.length * 15) / total,
        )
      : 100;

  // Upgrade handler
  const handleAutoUpgrade = (id: string, appName: string) => {
    setUpgradingId(id);

    // Generate secure randomized key
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]";
    let length = 16;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setTimeout(() => {
      onUpgradePassword(id, result);
      setUpgradingId(null);
      setUpgradeSuccess(appName);
      setTimeout(() => setUpgradeSuccess(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto">
      {/* Toast Confirmation for upgrade */}
      <AnimatePresence>
        {upgradeSuccess && (
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
                CRAVE OVERWRITE SUCCESS!
              </p>
              <p className="font-mono text-[10px] text-[#c8c7b8] mt-0.5">
                {upgradeSuccess} is now sealed with strong encryption runes!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 border-b-2 border-[#47483c] pb-4">
        <ShieldCheck className="w-7 h-7 text-[#ffb77d]" />
        <div>
          <h2 className="font-headline text-2xl text-[#ffb77d] uppercase tracking-wider">
            Sentinel Security Audit
          </h2>
          <p className="font-mono text-xs text-[#c8c7b8]/60 uppercase tracking-widest mt-1">
            Dynamic real-time scanner testing encryption walls and keys
            integrity
          </p>
        </div>
      </div>

      {/* Main Score & Audit Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="stone-slab p-6 border-4 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase text-[#c8c7b8]/60 tracking-wider block">
            INTEGRITY INDEX
          </span>
          <div className="py-4 text-center">
            <span
              className={`font-headline text-5xl font-black ${score >= 80 ? "text-[#c3cc8c]" : score >= 50 ? "text-[#ffb77d]" : "text-[#ffb4ab]"}`}
            >
              {score}%
            </span>
            <p className="font-mono text-[10px] text-[#c8c7b8] mt-1 uppercase tracking-widest">
              Total Sentinel Rating
            </p>
          </div>
          <div className="h-2 bg-[#131313] border border-[#47483c] p-0.5 mt-2">
            <div
              className={`h-full class transition-all duration-1000 ${score >= 80 ? "bg-[#c3cc8c] w-full" : score >= 50 ? "bg-[#ffb77d] w-2/3" : "bg-[#ffb4ab] w-1/3"}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        <div className="stone-slab p-5 border-2 flex flex-col justify-between space-y-4">
          <span className="font-mono text-[10px] uppercase text-[#c8c7b8]/60 tracking-wider">
            Key Strength Tally
          </span>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-[#47483c]/30">
              <span className="text-[#c3cc8c] font-bold">● Strong Seals</span>
              <span className="text-[#e5e2e1]">{strong.length} apps</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#47483c]/30">
              <span className="text-[#ffb77d] font-bold">● Medium Seals</span>
              <span className="text-[#e5e2e1]">{medium.length} apps</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#ffb4ab] font-bold">● Weak Seals</span>
              <span className="text-[#e5e2e1]">{weak.length} apps</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#c8c7b8]/40">
            Total scan volume: {total} elements.
          </div>
        </div>

        <div className="stone-slab p-5 border-2 flex flex-col justify-between space-y-4">
          <span className="font-mono text-[10px] uppercase text-[#c8c7b8]/60 tracking-wider">
            Severe Threat Tracker
          </span>
          <div className="space-y-4 pt-2">
            {weak.length > 0 ? (
              <div className="flex items-start gap-2 text-xs">
                <ShieldAlert className="w-5 h-5 text-[#ffb4ab] mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#ffb4ab] font-mono uppercase text-[11px]">
                    Weak Crypts Detected!
                  </h4>
                  <p className="text-[10px] text-[#c8c7b8] mt-0.5 leading-normal">
                    {weak.length} entries fail standard security filters length
                    or characters test.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs">
                <ShieldCheck className="w-5 h-5 text-[#c3cc8c] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#c3cc8c] font-mono uppercase text-[11px]">
                    No Weak Crypts
                  </h4>
                  <p className="text-[10px] text-[#c8c7b8] mt-0.5 leading-normal">
                    All password cells meet minimum strength thresholds.
                  </p>
                </div>
              </div>
            )}

            {duplicates.length > 0 ? (
              <div className="flex items-start gap-2 text-xs border-t border-[#47483c]/30 pt-3">
                <AlertTriangle className="w-5 h-5 text-[#ffb77d] mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-bold text-[#ffb77d] font-mono uppercase text-[11px]">
                    Duplicated Key Reuse!
                  </h4>
                  <p className="text-[10px] text-[#c8c7b8] mt-0.5 leading-normal">
                    {duplicates.length} keys are reused across multiple items,
                    allowing catastrophic access.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs border-t border-[#47483c]/30 pt-3">
                <ShieldCheck className="w-5 h-5 text-[#c3cc8c] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#c3cc8c] font-mono uppercase text-[11px]">
                    Perfect Uniqueness
                  </h4>
                  <p className="text-[10px] text-[#c8c7b8] mt-0.5 leading-normal">
                    Every app holds completely distinct passwords.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weak Passwords upgrade lists */}
      {weak.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-headline text-lg text-[#ffb4ab] uppercase tracking-wider flex items-center gap-2">
            ⚠️ Threat Vector: Weak Passwords
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weak.map((cred) => (
              <div
                key={`weak-upgrade-${cred.id}`}
                className="stone-slab p-4 border border-[#ffb4ab]/30 bg-[#2a2a2a]/40 shadow-inner flex justify-between items-center"
              >
                <div>
                  <h4 className="font-headline text-sm text-[#e5e2e1] uppercase tracking-wide group-hover:text-[#ffb77d] transition-colors">
                    {cred.name}
                  </h4>
                  <p className="font-mono text-[10px] text-[#c8c7b8] mt-0.5">
                    User: {cred.username}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-mono uppercase bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] px-1.5 py-0.5">
                      Weak Password
                    </span>
                    <span className="font-mono text-[10px] text-[#c8c7b8]/40 truncate max-w-[80px]">
                      ({cred.password})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAutoUpgrade(cred.id, cred.name)}
                  disabled={upgradingId === cred.id}
                  className="px-3.5 py-2.5 bg-[#93000a]/30 border border-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#131313] disabled:bg-[#1c1b1b] disabled:text-[#c8c7b8]/40 disabled:border-[#47483c] transition-all font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(255,180,171,0.3)] select-none"
                >
                  {upgradingId === cred.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      FORGING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      AUTO-CHOMP
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Duplicate / Reused passwords audit */}
      {duplicates.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-headline text-lg text-[#ffb77d] uppercase tracking-wider flex items-center gap-2">
            🔗 Threat Vector: Reused Passwords
          </h3>
          <div className="stone-slab p-5 border-2 border-[#ffb77d]/30 space-y-4">
            {duplicates.map((dup, index) => (
              <div
                key={`dup-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#47483c]/30 last:border-b-0 last:pb-0"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#ffb77d]/80 uppercase tracking-widest font-bold">
                      Identical Seal Crypt:
                    </span>
                    <span className="text-[#e5e2e1] bg-[#0e0e0e] border border-[#47483c] px-2 py-0.5">
                      ••••••••••••
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-[#c8c7b8] flex flex-wrap gap-1.5 items-center">
                    <span>Reused across:</span>
                    {dup.apps.map((app, appIdx) => (
                      <span
                        key={appIdx}
                        className="px-2 py-0.5 bg-[#353534] border border-[#47483c] text-[#ffb77d] uppercase text-[9px] tracking-wide"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#ffb77d] bg-[#fd8b00]/10 border border-[#ffb77d]/50 px-3 py-1.5 max-w-xs leading-relaxed uppercase tracking-wider text-center">
                  ⚠️ Diversify these keys inside Vault list
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Security is healthy dashboard message */}
      {weak.length === 0 && duplicates.length === 0 && (
        <div className="stone-slab p-8 border-4 border-[#c3cc8c]/40 bg-[#4b5320]/10 flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#4b5320] border-2 border-[#c3cc8c] flex items-center justify-center text-[#c3cc8c]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-headline text-lg text-[#c3cc8c] uppercase tracking-wider">
            Sentinel Status: Maximum Guard
          </h3>
          <p className="font-body text-xs text-[#c8c7b8] max-w-sm leading-relaxed">
            All database keys hold sufficient uniqueness and high cryptographic
            complexity scores. The monster is completely satisfied. Keep it
            secure!
          </p>
        </div>
      )}
    </div>
  );
}
