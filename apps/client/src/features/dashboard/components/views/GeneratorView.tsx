import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  Sparkles,
  Check,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAddCredential } from "./VaultView/hooks/useVaultMutations";
import type { CredentialBody } from "@chomp/shared";

export default function GeneratorView() {
  const addMutation = useAddCredential();
  const { setActiveTab, setSelectedGroup, setSearchQuery } =
    useDashboardStore();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedGroup("All");
    setSearchQuery("Forge");
  }, [setSelectedGroup, setSearchQuery]);

  const onAddSecurely = (generatedPassword: string) => {
    const payload: CredentialBody = {
      id: crypto.randomUUID(),
      name: "Unassigned Forge",
      username: "user_handle",
      password: generatedPassword,
      group: "Personal",
      websiteUrl: "",
      notes: "Slab key forged inside Primitive Key Generator.",
      lastUpdated: new Date().toISOString().split("T")[0],
      isFavorite: false,
    };
    addMutation.mutate(payload, {
      onSuccess: () => setActiveTab("vault"),
    });
  };
  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setPassword("Please select at least one character type!");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    if (window.crypto) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += charset.charAt(array[i] % charset.length);
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    if (!password || password.startsWith("Please")) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass || pass.startsWith("Please"))
      return {
        text: "None",
        score: 0,
        color: "text-muted-foreground",
        style: "bg-[#47483c]",
      };

    let score = 0;
    if (pass.length >= 8) score += 20;
    if (pass.length >= 12) score += 20;
    if (pass.length >= 16) score += 10;

    const countTypes = [
      /[A-Z]/.test(pass),
      /[a-z]/.test(pass),
      /\d/.test(pass),
      /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(pass),
    ].filter(Boolean).length;

    score += countTypes * 12.5;

    if (score >= 80)
      return {
        text: "Absolute Guarded",
        score,
        color: "text-[#c3cc8c]",
        style: "bg-[#c3cc8c] w-full",
      };
    if (score >= 50)
      return {
        text: "Reinforced Medium",
        score,
        color: "text-[#ffb77d]",
        style: "bg-[#ffb77d] w-2/3",
      };
    return {
      text: "Fragile Stone",
      score,
      color: "text-[#ffb4ab]",
      style: "bg-[#ffb4ab] w-1/3",
    };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-8 select-none max-w-3xl mx-auto">
      <AnimatePresence>
        {copied && (
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
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Key Transcribed!
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                Saved safely to your clipboard buffer page.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 border-b-2 border-border pb-4">
        <Sparkles className="w-7 h-7 text-[#ffb77d]" />
        <div>
          <h2 className="font-headline text-2xl text-[#ffb77d] uppercase tracking-wider">
            Primitive Key Forge
          </h2>
          <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mt-1">
            Chomp through random entropy to shape high-encryption seals
          </p>
        </div>
      </div>

      <div className="stone-slab p-6 md:p-8 border-4 border-border space-y-6">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60 mb-2">
            Generated Runes Key
          </label>
          <div className="relative">
            <Input
              type="text"
              readOnly
              value={password}
              placeholder="Click Chomp & Generate below..."
              className="w-full bg-input border-2 border-border px-4 py-3.5 pr-24 text-base font-mono text-[#ffb77d] tracking-wider focus:outline-none placeholder:text-muted-foreground/20 select-all leading-none focus:border-[#ffb77d] transition-all h-14 rounded-none"
            />
            {password && !password.startsWith("Please") && (
              <div className="absolute right-2 top-2 flex gap-1.5">
                <Button
                  type="button"
                  onClick={copyToClipboard}
                  variant="outline"
                  className="px-3 h-10 bg-card border-border text-muted-foreground hover:text-[#ffb77d] hover:bg-card hover:border-[#ffb77d] font-mono text-xs uppercase tracking-wider transition-colors rounded-none"
                  title="Copy secret key"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {password && !password.startsWith("Please") && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-background border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
          >
            <div className="flex items-center gap-2.5">
              {strength.score >= 50 ? (
                <ShieldCheck className="w-5 h-5 text-[#c3cc8c]" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-[#ffb4ab] animate-pulse" />
              )}
              <div>
                <span className="text-muted-foreground/60">Cryptic Density: </span>
                <span
                  className={`font-bold uppercase tracking-widest ${strength.color}`}
                >
                  {strength.text} [{Math.round(strength.score)} pts]
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-stone-400 text-[10px]">
                Tectonic Strength:
              </span>
              <div className="h-2 w-32 bg-card border border-border p-0.5">
                <div
                  className={`h-full transition-all duration-700 ${strength.style}`}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Rune Character Length
              </span>
              <span className="bg-input border border-border px-3 py-1 font-mono text-[#ffb77d] font-bold text-sm">
                {length} runes
              </span>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                min={6}
                max={32}
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
                className="w-full accent-[#ffb77d] bg-input rounded-none border border-border h-3 py-1.5 cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[9px] text-muted-foreground/40">
                <span>Min: 6 (Weak)</span>
                <span>Normal: 16 (Recommended)</span>
                <span>Max: 32 (Impenetrable)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="block text-muted-foreground/60 uppercase text-[10px] tracking-wider mb-2">
              Allowed Cryptic Blocks
            </span>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setIncludeUppercase(!includeUppercase)}
                className="flex items-center gap-2.5 p-2 bg-background border border-border hover:border-[#ffb77d] transition-colors cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${includeUppercase ? "bg-[#4b5320] border-[#c3cc8c] text-[#c3cc8c]" : "bg-input border-border"}`}
                >
                  {includeUppercase && <Check className="w-3 h-3" />}
                </div>
                <span className="text-muted-foreground">A-Z Upper</span>
              </label>

              <label
                onClick={() => setIncludeLowercase(!includeLowercase)}
                className="flex items-center gap-2.5 p-2 bg-background border border-border hover:border-[#ffb77d] transition-colors cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${includeLowercase ? "bg-[#4b5320] border-[#c3cc8c] text-[#c3cc8c]" : "bg-input border-border"}`}
                >
                  {includeLowercase && <Check className="w-3 h-3" />}
                </div>
                <span className="text-muted-foreground">a-z Lower</span>
              </label>

              <label
                onClick={() => setIncludeNumbers(!includeNumbers)}
                className="flex items-center gap-2.5 p-2 bg-background border border-border hover:border-[#ffb77d] transition-colors cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${includeNumbers ? "bg-[#4b5320] border-[#c3cc8c] text-[#c3cc8c]" : "bg-input border-border"}`}
                >
                  {includeNumbers && <Check className="w-3 h-3" />}
                </div>
                <span className="text-muted-foreground">0-9 Numbers</span>
              </label>

              <label
                onClick={() => setIncludeSymbols(!includeSymbols)}
                className="flex items-center gap-2.5 p-2 bg-background border border-border hover:border-[#ffb77d] transition-colors cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-colors ${includeSymbols ? "bg-[#4b5320] border-[#c3cc8c] text-[#c3cc8c]" : "bg-input border-border"}`}
                >
                  {includeSymbols && <Check className="w-3 h-3" />}
                </div>
                <span className="text-muted-foreground">@%# Symbols</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
          <Button
            type="button"
            onClick={generatePassword}
            className="flex-1 h-12 bg-[#4b5320] border-2 border-[#c3cc8c] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] font-mono text-[13px] uppercase tracking-wider font-bold transition-all shadow-[0_0_10px_rgba(195,204,140,0.15)] hover:shadow-[0_0_20px_rgba(195,204,140,0.4)] flex gap-2 rounded-none"
          >
            <Sparkles
              className="w-4 h-4 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            CHOMP & GENERATE KEY
          </Button>

          {password && !password.startsWith("Please") && (
            <Button
              type="button"
              onClick={() => onAddSecurely(password)}
              disabled={addMutation.isPending}
              variant="outline"
              className="sm:w-1/3 h-12 bg-transparent border-2 border-[#ffb77d] text-[#ffb77d] hover:bg-[#ffb77d] hover:text-[#131313] font-mono text-[12px] uppercase tracking-wider font-bold transition-all flex gap-1.5 rounded-none"
            >
              <Lock className="w-4 h-4" />
              {addMutation.isPending ? "Encrypting..." : "Deposit In Vault"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
