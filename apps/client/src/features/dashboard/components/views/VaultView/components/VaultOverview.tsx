interface VaultOverviewProps {
  totalCrypts: number;
  strongSeals: number;
  securityScore: number;
}

export function VaultOverview({ totalCrypts, strongSeals, securityScore }: VaultOverviewProps) {
  const getHealthLevelText = (score: number) => {
    if (score >= 80) return "Security Health: Strong";
    if (score >= 50) return "Security Health: Guarded";
    return "Security Health: Critical Danger";
  };

  const getHealthLevelColor = (score: number) => {
    if (score >= 80) return "text-[#c3cc8c] bg-[#4b5320]/40 border-[#c3cc8c]";
    if (score >= 50) return "text-[#ffb77d] bg-[#fd8b00]/10 border-[#ffb77d]";
    return "text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab] animate-pulse";
  };

  const needleRotation = -90 + (securityScore / 100) * 180;

  return (
    <section className="stone-slab p-6 sm:p-8 border-4 border-border relative">
      <div className="absolute top-2 left-2 text-[9px] font-mono text-muted-foreground/20 tracking-tighter">
        ⊞ S_SLAB_00
      </div>
      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-muted-foreground/20 tracking-tighter">
        🔒 MONSTER_ACTIVE
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl text-[#ffb77d] uppercase tracking-wider mb-2">
            Monster Vault Overview
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed">
            Your secrets are currently heavily guarded. The monster's hunger is
            satisfied by strong cryptography. Keep key entropy maximum.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono">
            <div className="bg-popover border border-border px-3 py-1 text-muted-foreground">
              TOTAL CRYPTS: <span className="text-[#ffb77d] font-bold">{totalCrypts}</span>
            </div>
            <div className="bg-popover border border-border px-3 py-1 text-muted-foreground">
              STRONG SEALS: <span className="text-[#c3cc8c] font-bold">{strongSeals}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-48 h-24 overflow-hidden mb-2">
            <div className="monster-gauge w-48 h-48 absolute top-0 left-0" />
            <div className="gauge-cover w-40 h-40 absolute top-4 left-4 flex items-end justify-center pb-3">
              <span className="font-headline text-3xl font-black text-[#c3cc8c] tracking-tighter mb-1 select-none">
                {securityScore}%
              </span>
            </div>
            <div
              className="absolute bottom-0 left-1/2 w-1.5 h-18 bg-[#ffb77d] origin-bottom rounded-full shadow-[0_0_8px_#ffb77d] transition-transform duration-1000 ease-out"
              style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
            />
          </div>
          <span
            className={`text-[11px] font-mono uppercase tracking-widest px-3 py-1 border transition-colors ${getHealthLevelColor(securityScore)}`}
          >
            {getHealthLevelText(securityScore)}
          </span>
        </div>
      </div>
    </section>
  );
}