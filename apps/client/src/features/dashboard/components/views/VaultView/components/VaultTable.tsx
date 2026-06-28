import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Eye, EyeOff, Trash2, Edit, ExternalLink, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVaultData } from "../hooks/useVaultData";
import { useVaultStore } from "@/store/useVaultStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useVaultUIStore } from "@/store/useVaultUiStore";

export function VaultTable() {
  const { sortedCredentials } = useVaultData();
  const { deleteCredential } = useVaultStore();
  const { openPortalModal, setCustomPrompt } = useDashboardStore();
  
  const { 
    expandedId, revealedIds, visibleLimit, 
    toggleExpand, toggleReveal, triggerCopy, loadMore, showLess 
  } = useVaultUIStore();

  const handlePurge = (id: string) => {
    setCustomPrompt({
      isOpen: true,
      title: "TECTONIC PURGE COMMENCEMENT",
      message: "Are you absolutely sure you want to purge this secure runestone key forever? This operation is completely irreversible.",
      type: "confirm",
      onConfirm: () => deleteCredential(id),
    });
  };

  return (
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
                <td colSpan={5} className="p-8 text-center text-[#c8c7b8]/60 uppercase tracking-widest font-mono">
                  No matching secrets secured in database.
                </td>
              </tr>
            ) : (
              sortedCredentials.slice(0, visibleLimit).map((cred) => (
                <React.Fragment key={cred.id}>
                  <tr
                    onClick={() => toggleExpand(cred.id)}
                    className={`hover:bg-[#353534]/50 cursor-pointer transition-colors group ${
                      expandedId === cred.id ? "bg-[#353534]/70 border-l-2 border-l-[#ffb77d]" : ""
                    }`}
                  >
                    <td className="p-4 font-bold text-[#e5e2e1] flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#131313] border border-[#47483c] flex items-center justify-center text-[#ffb77d] font-headline select-none">
                        {cred.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="group-hover:text-[#ffb77d] transition-colors truncate max-w-[150px]">{cred.name}</span>
                    </td>
                    <td className="p-4 text-[#c8c7b8] truncate max-w-[150px]">{cred.username}</td>
                    <td className="p-4 text-[#c8c7b8]" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <span className="tracking-widest font-bold text-[#e5e2e1] select-none text-[13px]">
                          {revealedIds.includes(cred.id) ? cred.password : "••••••••••••"}
                        </span>
                        <Button
                          onClick={(e) => toggleReveal(cred.id, e)}
                          variant="ghost" size="icon-xs"
                          className="text-[#c8c7b8]/60 hover:text-[#ffb77d] hover:bg-transparent"
                        >
                          {revealedIds.includes(cred.id) ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
                        </Button>
                        <Button
                          onClick={() => triggerCopy(cred.password, cred.id, "password")}
                          variant="ghost" size="icon-xs"
                          className="text-[#c8c7b8]/60 hover:text-[#ffb77d] hover:bg-transparent"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-[#47483c]/20 text-[#c8c7b8] border border-[#47483c]/50 text-[10px]">{cred.group}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono border ${
                        cred.strength === "Strong" ? "bg-[#4b5320]/20 border-[#c3cc8c] text-[#c3cc8c]" :
                        cred.strength === "Medium" ? "bg-[#fd8b00]/10 border-[#ffb77d] text-[#ffb77d]" : "bg-[#93000a]/20 border-[#ffb4ab] text-[#ffb4ab]"
                      }`}>
                        {cred.strength === "Strong" ? <Check className="w-3 h-3"/> : cred.strength === "Medium" ? <Sparkles className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3"/>}
                        {cred.strength}
                      </span>
                    </td>
                  </tr>

                  <AnimatePresence>
                    {expandedId === cred.id && (
                      <tr className="bg-[#1c1b1b]/80 border-t border-b border-[#47483c]/50">
                        <td colSpan={5} className="p-4 font-mono select-none">
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-1">
                              <div>
                                <h5 className="text-[10px] uppercase text-[#c8c7b8]/50 tracking-wider">Secure Note Carvings</h5>
                                <p className="text-xs text-[#c8c7b8] bg-[#0e0e0e] border border-[#47483c]/50 p-2.5 mt-1 whitespace-pre-wrap">{cred.notes || "No secure notes inscribed."}</p>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between py-1 border-b border-[#47483c]/30">
                                  <span className="text-[#c8c7b8]/60">Portal:</span>
                                  <span className="text-[#e5e2e1] truncate max-w-[200px]">
                                    {cred.websiteUrl ? <a href={cred.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#ffb77d]">{cred.websiteUrl} <ExternalLink className="w-3 h-3"/></a> : "Unassigned"}
                                  </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-[#47483c]/30">
                                  <span className="text-[#c8c7b8]/60">Updated:</span>
                                  <span>{cred.lastUpdated || "Initial setup"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2 border-t border-[#47483c]/30">
                              <Button onClick={() => triggerCopy(cred.username, cred.id, "username")} variant="outline" className="h-7 bg-[#201f1f] border-[#47483c] text-xs font-mono rounded-none"><Copy className="w-3 h-3 mr-1"/> Copy User</Button>
                              <Button onClick={() => openPortalModal(cred)} variant="outline" className="h-7 bg-[#4b5320]/20 border-[#c3cc8c]/40 text-[#c3cc8c] text-xs font-mono rounded-none"><Edit className="w-3 h-3 mr-1"/> Modify</Button>
                              <Button onClick={() => handlePurge(cred.id)} variant="outline" className="h-7 bg-[#93000a]/20 border-[#ffb4ab]/40 text-[#ffb4ab] text-xs font-mono rounded-none"><Trash2 className="w-3 h-3 mr-1"/> Purge</Button>
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
        <div className="p-4 border-t-2 border-[#47483c] bg-[#2a2a2a] text-center">
          <Button variant="ghost" onClick={() => loadMore(sortedCredentials.length)} className="text-xs font-mono uppercase text-[#ffb77d] hover:text-[#c3cc8c] font-bold">Load More Secrets</Button>
        </div>
      )}
      {visibleLimit > 5 && sortedCredentials.length > 5 && (
        <div className="p-4 border-t border-[#47483c]/30 bg-[#2a2a2a] text-center">
          <Button variant="ghost" onClick={showLess} className="text-[10px] font-mono uppercase text-[#c8c7b8]/60 hover:text-[#ffb77d]">Show less secrets</Button>
        </div>
      )}
    </div>
  );
}