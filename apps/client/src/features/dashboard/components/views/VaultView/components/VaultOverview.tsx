import { Lock } from "lucide-react";

interface VaultOverviewProps {
  totalCrypts: number;
  strongSeals: number;
  securityScore: number;
}

export function VaultOverview({
  totalCrypts,
  strongSeals,
  securityScore,
}: VaultOverviewProps) {
  const getHealthLevelText = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 50) return "Guarded";
    return "Danger";
  };

  const getHealthLevelColor = (score: number) => {
    if (score >= 80) return "text-[#c3cc8c] border-[#c3cc8c] bg-[#4b5320]/30";
    if (score >= 50) return "text-[#ffb77d] border-[#ffb77d] bg-[#fd8b00]/10";
    return "text-[#ffb4ab] border-[#ffb4ab] bg-[#93000a]/20 animate-pulse";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-[#c3cc8c]";
    if (score >= 50) return "bg-[#ffb77d]";
    return "bg-[#ffb4ab]";
  };

  return (
    <section className="stone-slab px-3.5 py-2.5 sm:px-5 sm:py-3 border-2 border-border flex items-center justify-between gap-3 text-xs font-mono">
      {/* Left: Vault Title & Mini Badges */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2a2a2a] border border-border flex items-center justify-center text-[#ffb77d] shrink-0">
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffb77d]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-xs sm:text-sm text-[#ffb77d] uppercase tracking-wider truncate">
              Vault Overview
            </h2>
            <span
              className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 border shrink-0 ${getHealthLevelColor(securityScore)}`}
            >
              {getHealthLevelText(securityScore)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80 mt-0.5">
            <span>
              Crypts: <strong className="text-[#ffb77d]">{totalCrypts}</strong>
            </span>
            <span>•</span>
            <span>
              Strong: <strong className="text-[#c3cc8c]">{strongSeals}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Compact Score & Progress Bar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-20 sm:w-28 space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground/60 uppercase">Entropy</span>
            <span className="font-bold text-foreground">{securityScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#1c1b1b] border border-border/60 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${getBarColor(securityScore)}`}
              style={{ width: `${securityScore}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}