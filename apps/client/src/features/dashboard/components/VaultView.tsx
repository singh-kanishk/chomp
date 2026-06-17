import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  PlusCircle,
  ArrowUpDown,
  Trash2,
  Edit,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { GroupType } from "../schemas/schema";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVaultStore } from "@/store/useVaultStore";

export default function VaultView() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGroup,
    setSelectedGroup,
    openPortalModal,
    setCustomPrompt,
  } = useDashboardStore();
  const { credentials, deleteCredential } = useVaultStore();
  const onAddPasswordClick = () => openPortalModal();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"username" | "password" | null>(
    null,
  );
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(5);
  const [sortBy, setSortBy] = useState<"name" | "strength" | "group">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const onDeletePasswordClick = (id: string) => {
    setCustomPrompt({
      isOpen: true,
      title: "TECTONIC PURGE COMMENCEMENT",
      message:
        "Are you absolutely sure you want to purge this secure runestone key forever? This operation is completely irreversible.",
      type: "confirm",
      onConfirm: () => deleteCredential(id),
    });
  };

  const copyToClipboard = (
    text: string,
    id: string,
    type: "username" | "password",
  ) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedType(null);
    }, 2000);
  };

  const toggleReveal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (revealedIds.includes(id)) {
      setRevealedIds(revealedIds.filter((item) => item !== id));
    } else {
      setRevealedIds([...revealedIds, id]);
    }
  };

  const filteredCredentials = credentials.filter((cred) => {
    const matchesGroup =
      selectedGroup === "All" || cred.group === selectedGroup;
    const matchesSearch =
      cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cred.websiteUrl &&
        cred.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cred.group.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const sortedCredentials = [...filteredCredentials].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "strength") {
      const strengthVal = { Strong: 3, Medium: 2, Weak: 1 };
      comparison = strengthVal[a.strength] - strengthVal[b.strength];
    } else if (sortBy === "group") {
      comparison = a.group.localeCompare(b.group);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSort = (field: "name" | "strength" | "group") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const calculateSecurityScore = () => {
    if (credentials.length === 0) return 100;
    let scoreTotal = 0;
    credentials.forEach((c) => {
      if (c.strength === "Strong") scoreTotal += 100;
      else if (c.strength === "Medium") scoreTotal += 55;
      else scoreTotal += 15;
    });
    return Math.round(scoreTotal / credentials.length);
  };

  const securityScore = calculateSecurityScore();
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
  const groups: GroupType[] = ["All", "Personal", "Work", "Social", "Finance"];

  return (
    <div className="space-y-10 select-none">
      <AnimatePresence>
        {copiedId && (
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
                Copied {copiedType} to local scroll board.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="stone-slab p-6 sm:p-8 border-4 border-[#47483c]">
        <div className="absolute top-2 left-2 text-[9px] font-mono text-[#c8c7b8]/20 tracking-tighter">
          ⊞ S_SLAB_00
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[#c8c7b8]/20 tracking-tighter">
          🔒 MONSTER_ACTIVE
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <h2 className="font-headline text-2xl sm:text-3xl text-[#ffb77d] uppercase tracking-wider mb-2">
              Monster Vault Overview
            </h2>
            <p className="font-body text-sm text-[#c8c7b8] max-w-lg leading-relaxed">
              Your secrets are currently heavily guarded. The monster's hunger
              is satisfied by strong cryptography. Keep key entropy maximum.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono">
              <div className="bg-[#1c1b1b] border border-[#47483c] px-3 py-1 text-[#c8c7b8]">
                TOTAL CRYPTS:{" "}
                <span className="text-[#ffb77d] font-bold">
                  {credentials.length}
                </span>
              </div>
              <div className="bg-[#1c1b1b] border border-[#47483c] px-3 py-1 text-[#c8c7b8]">
                STRONG SEALS:{" "}
                <span className="text-[#c3cc8c] font-bold">
                  {credentials.filter((c) => c.strength === "Strong").length}
                </span>
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
                style={{
                  transform: `translateX(-50%) rotate(${needleRotation}deg)`,
                }}
              />
            </div>
            <span
              className={`text-[11px] font-mono uppercase tracking-widest px-3 py-1 border transition-colors ${getHealthLevelColor(
                securityScore,
              )}`}
            >
              {getHealthLevelText(securityScore)}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-headline text-xl text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2">
          <span className="text-[#ffb77d]">✦</span> Quick Access
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {credentials.slice(0, 3).map((cred) => {
            const firstChar = cred.name.charAt(0).toUpperCase();
            return (
              <div
                key={`quick-${cred.id}`}
                onClick={() =>
                  setExpandedId(expandedId === cred.id ? null : cred.id)
                }
                className="stone-slab hover-ignite p-5 cursor-pointer flex flex-col justify-between aspect-square group transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-[#2a2a2a] border-2 border-[#47483c] flex items-center justify-center text-xl font-headline text-[#ffb77d] group-hover:border-[#ffb77d] transition-colors shadow-inner">
                    {firstChar}
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(cred.password, cred.id, "password");
                      }}
                      size="icon-sm"
                      variant="outline"
                      className="border-[#47483c] hover:border-[#ffb77d] hover:text-[#ffb77d] text-[#c8c7b8] bg-[#131313]"
                      title="Copy Password"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-body text-base font-bold text-[#e5e2e1] group-hover:text-[#ffb77d] transition-colors truncate">
                    {cred.name}
                  </h4>
                  <p className="font-mono text-xs text-[#c8c7b8]/60 mt-1 truncate">
                    {cred.username}
                  </p>
                  <div className="mt-2 flex justify-between items-center text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 bg-[#47483c]/30 text-[#c8c7b8] border border-[#47483c]/50">
                      {cred.group}
                    </span>
                    <span
                      className={`font-bold ${
                        cred.strength === "Strong"
                          ? "text-[#c3cc8c]"
                          : cred.strength === "Medium"
                            ? "text-[#ffb77d]"
                            : "text-[#ffb4ab]"
                      }`}
                    >
                      • {cred.strength}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            onClick={onAddPasswordClick}
            className="stone-slab hover-ignite p-5 cursor-pointer flex flex-col justify-between aspect-square border-dashed border-[#47483c] hover:bg-[#ffb77d]/5 group transition-all"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <PlusCircle className="w-10 h-10 text-[#c8c7b8]/40 group-hover:text-[#ffb77d] transition-colors mb-2" />
              <span className="font-mono text-xs text-[#c8c7b8]/60 group-hover:text-[#ffb77d] transition-colors uppercase tracking-widest">
                Add Shortcut
              </span>
            </div>
            <div className="text-center font-mono text-[9px] text-[#c8c7b8]/30">
              SLAB SECURE KEY
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pb-2">
          <h3 className="font-headline text-xl text-[#e5e2e1] uppercase tracking-wider flex items-center gap-2">
            <span className="text-[#ffb77d]">✦</span> Credential Vault
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Live search vault..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0e0e0e] border-[#47483c] pl-8 pr-3 py-1 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d] font-mono placeholder:text-[#c8c7b8]/40 h-8 transition-colors rounded-none"
              />
              <Search className="w-3.5 h-3.5 text-[#c8c7b8]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <Button
              onClick={() => toggleSort("name")}
              variant="outline"
              className={`h-8 flex items-center gap-1 bg-[#201f1f] border-[#47483c] text-xs font-mono uppercase tracking-wider text-[#c8c7b8] hover:border-[#ffb77d] hover:text-[#ffb77d] rounded-none ${
                sortBy === "name" ? "border-[#ffb77d] text-[#ffb77d]" : ""
              }`}
              title="Sort Alphabetically"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sort</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none antialiased">
          {groups.map((group) => (
            <Button
              key={group}
              onClick={() => setSelectedGroup(group)}
              variant="outline"
              className={`px-4 py-1.5 h-auto font-mono text-xs uppercase tracking-widest rounded-none ${
                selectedGroup === group
                  ? "bg-[#4b5320] border-[#c3cc8c] text-[#bdc787] hover:bg-[#4b5320] hover:text-[#bdc787] shadow-[0_0_10px_rgba(195,204,140,0.15)]"
                  : "bg-[#201f1f] border-[#47483c] text-[#c8c7b8] hover:bg-[#201f1f] hover:border-[#ffb77d] hover:text-[#ffb77d]"
              }`}
            >
              {group}
            </Button>
          ))}
        </div>

        <div className="stone-slab border-2 border-[#47483c] p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-[#2a2a2a] border-b-2 border-[#47483c] font-mono text-[11px] uppercase tracking-wider text-[#c8c7b8]">
                  <th className="p-4 w-[28%]">Website / App</th>
                  <th className="p-4 w-[22%]">Username</th>
                  <th className="p-4 w-[25%]">Password</th>
                  <th className="p-4 w-[13%]">Group</th>
                  <th className="p-4 w-[12%] text-right">Security</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs divide-y divide-[#47483c]/30">
                {sortedCredentials.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-[#c8c7b8]/60 uppercase tracking-widest font-mono"
                    >
                      No matching secrets secured in database.
                    </td>
                  </tr>
                ) : (
                  sortedCredentials.slice(0, visibleLimit).map((cred) => (
                    <React.Fragment key={cred.id}>
                      <tr
                        onClick={() =>
                          setExpandedId(expandedId === cred.id ? null : cred.id)
                        }
                        className={`hover:bg-[#353534]/50 cursor-pointer transition-colors group ${
                          expandedId === cred.id
                            ? "bg-[#353534]/70 border-l-2 border-l-[#ffb77d]"
                            : ""
                        }`}
                      >
                        <td className="p-4 font-bold text-[#e5e2e1] flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#131313] border border-[#47483c] flex items-center justify-center text-[#ffb77d] font-headline select-none">
                            {cred.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="group-hover:text-[#ffb77d] transition-colors truncate max-w-[150px]">
                            {cred.name}
                          </span>
                        </td>
                        <td className="p-4 text-[#c8c7b8] truncate max-w-[150px]">
                          {cred.username}
                        </td>
                        <td
                          className="p-4 text-[#c8c7b8]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <span className="tracking-widest font-bold text-[#e5e2e1] select-none text-[13px]">
                              {revealedIds.includes(cred.id)
                                ? cred.password
                                : "••••••••••••"}
                            </span>
                            <Button
                              onClick={(e) => toggleReveal(cred.id, e)}
                              variant="ghost"
                              size="icon-xs"
                              className="text-[#c8c7b8]/60 hover:text-[#ffb77d] hover:bg-transparent"
                              title={
                                revealedIds.includes(cred.id)
                                  ? "Mask secrecy"
                                  : "Reveal secrecy"
                              }
                            >
                              {revealedIds.includes(cred.id) ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </Button>
                            <Button
                              onClick={() =>
                                copyToClipboard(
                                  cred.password,
                                  cred.id,
                                  "password",
                                )
                              }
                              variant="ghost"
                              size="icon-xs"
                              className="text-[#c8c7b8]/60 hover:text-[#ffb77d] hover:bg-transparent"
                              title="Copy passphrase key"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-[#47483c]/20 text-[#c8c7b8] border border-[#47483c]/50 text-[10px]">
                            {cred.group}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono border ${
                              cred.strength === "Strong"
                                ? "bg-[#4b5320]/20 border-[#c3cc8c] text-[#c3cc8c]"
                                : cred.strength === "Medium"
                                  ? "bg-[#fd8b00]/10 border-[#ffb77d] text-[#ffb77d]"
                                  : "bg-[#93000a]/20 border-[#ffb4ab] text-[#ffb4ab]"
                            }`}
                          >
                            {cred.strength === "Strong" ? (
                              <Check className="w-3 h-3 text-[#c3cc8c]" />
                            ) : cred.strength === "Medium" ? (
                              <Sparkles className="w-3 h-3 text-[#ffb77d]" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-[#ffb4ab]" />
                            )}
                            {cred.strength}
                          </span>
                        </td>
                      </tr>

                      <AnimatePresence>
                        {expandedId === cred.id && (
                          <tr className="bg-[#1c1b1b]/80 border-t border-b border-[#47483c]/50">
                            <td
                              colSpan={5}
                              className="p-4 font-mono select-none"
                            >
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden space-y-3"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-1">
                                  <div>
                                    <h5 className="text-[10px] uppercase text-[#c8c7b8]/50 tracking-wider">
                                      Secure Note Carvings
                                    </h5>
                                    <p className="text-xs text-[#c8c7b8] bg-[#0e0e0e] border border-[#47483c]/50 p-2.5 mt-1 rounded-sm leading-relaxed whitespace-pre-wrap">
                                      {cred.notes ||
                                        "No secure notes inscribed inside this secret crypt."}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs py-1 border-b border-[#47483c]/30">
                                      <span className="text-[#c8c7b8]/60">
                                        Login Address:
                                      </span>
                                      <span className="text-[#e5e2e1] hover:text-[#ffb77d] transition-colors truncate max-w-[200px]">
                                        {cred.websiteUrl ? (
                                          <a
                                            href={cred.websiteUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 justify-end"
                                          >
                                            {cred.websiteUrl}{" "}
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        ) : (
                                          "Unassigned Portal"
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs py-1 border-b border-[#47483c]/30">
                                      <span className="text-[#c8c7b8]/60">
                                        Crypt Updated:
                                      </span>
                                      <span className="text-[#e5e2e1]">
                                        {cred.lastUpdated || "Initial setup"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs py-1">
                                      <span className="text-[#c8c7b8]/60">
                                        Cryptic Strength:
                                      </span>
                                      <span
                                        className={`font-bold uppercase ${cred.strength === "Strong" ? "text-[#c3cc8c]" : cred.strength === "Medium" ? "text-[#ffb77d]" : "text-[#ffb4ab]"}`}
                                      >
                                        {cred.strength} Entropy
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2 border-t border-[#47483c]/30">
                                  <Button
                                    onClick={() =>
                                      copyToClipboard(
                                        cred.username,
                                        cred.id,
                                        "username",
                                      )
                                    }
                                    variant="outline"
                                    className="px-3 py-1.5 h-auto bg-[#201f1f] border-[#47483c] hover:border-[#ffb77d] text-[#c8c7b8] hover:text-[#ffb77d] text-[11px] uppercase tracking-wider transition-colors gap-1 rounded-none"
                                  >
                                    <Copy className="w-3 h-3" /> Copy username
                                  </Button>
                                  <Button
                                    onClick={() => openPortalModal(cred)}
                                    variant="outline"
                                    className="px-3 py-1.5 h-auto bg-[#4b5320]/20 border-[#c3cc8c]/40 hover:border-[#c3cc8c] hover:bg-[#4b5320]/20 text-[#c3cc8c] text-[11px] uppercase tracking-wider transition-all gap-1 rounded-none"
                                  >
                                    <Edit className="w-3 h-3" /> Modify slab
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      onDeletePasswordClick(cred.id)
                                    }
                                    variant="outline"
                                    className="px-3 py-1.5 h-auto bg-[#93000a]/20 border-[#ffb4ab]/40 hover:border-[#ffb4ab] hover:bg-[#93000a]/20 text-[#ffb4ab] text-[11px] uppercase tracking-wider transition-all gap-1 rounded-none"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Purge
                                    Crypt
                                  </Button>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {sortedCredentials.length > visibleLimit && (
            <div className="p-4 border-t-2 border-[#47483c] bg-[#2a2a2a] text-center select-none">
              <Button
                variant="ghost"
                onClick={() =>
                  setVisibleLimit(
                    Math.min(visibleLimit + 5, sortedCredentials.length),
                  )
                }
                className="text-mono text-xs uppercase text-[#ffb77d] hover:text-[#c3cc8c] tracking-widest font-bold transition-colors hover:bg-transparent"
              >
                Load More Secrets
              </Button>
            </div>
          )}
          {visibleLimit > 5 && sortedCredentials.length > 5 && (
            <div className="p-4 border-t border-[#47483c]/30 bg-[#2a2a2a] text-center select-none">
              <Button
                variant="ghost"
                onClick={() => setVisibleLimit(5)}
                className="text-mono text-[10px] uppercase text-[#c8c7b8]/60 hover:text-[#ffb77d] tracking-widest transition-colors hover:bg-transparent"
              >
                Show less secrets
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
