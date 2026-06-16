import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import type { Credential } from "../schemas/schema";

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Credential, "id" | "strength">) => void;
  editingCredential?: Credential | null;
}

export default function PortalModal({
  isOpen,
  onClose,
  onSave,
  editingCredential,
}: PortalModalProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState<
    "Personal" | "Work" | "Social" | "Finance"
  >("Personal");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editingCredential) {
      setName(editingCredential.name);
      setUsername(editingCredential.username);
      setPassword(editingCredential.password);
      setGroup(editingCredential.group);
      setWebsiteUrl(editingCredential.websiteUrl || "");
      setNotes(editingCredential.notes || "");
    } else {
      setName("");
      setUsername("");
      setPassword("");
      setGroup("Personal");
      setWebsiteUrl("");
      setNotes("");
    }
  }, [editingCredential, isOpen]);

  // Analyze password strength
  const getPasswordStrength = (pass: string): "Strong" | "Medium" | "Weak" => {
    if (pass.length < 6) return "Weak";
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasNonalphas = /\W/.test(pass);
    const count = [hasUpperCase, hasLowerCase, hasNumbers, hasNonalphas].filter(
      Boolean,
    ).length;

    if (pass.length >= 12 && count >= 3) return "Strong";
    if (pass.length >= 8 && count >= 2) return "Medium";
    return "Weak";
  };

  const strength = password ? getPasswordStrength(password) : "Weak";

  const handleGenerateRandom = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]";
    let length = 16;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) return;
    onSave({
      name,
      username,
      password,
      group,
      websiteUrl,
      notes,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Stone Slab container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="stone-slab border-4 border-[#47483c] w-full max-w-lg p-6 overflow-hidden relative text-[#e5e2e1]"
          >
            {/* Ambient fire glow border top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffb77d]/60 to-transparent" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-[#919283]/30 bg-[#1c1b1b]">
                  <Lock className="w-5 h-5 text-[#ffb77d]" />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-[#ffb77d] uppercase tracking-wider">
                    {editingCredential
                      ? "Modify Encryption Crypt"
                      : "Secure New Secret"}
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#c8c7b8]/60">
                    Slab Portal v2.0
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 border border-[#47483c] bg-[#1c1b1b] text-[#c8c7b8] hover:text-[#ffb77d] hover:border-[#ffb77d] transition-colors"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 font-body text-sm select-none"
            >
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#c8c7b8] mb-1">
                  Website / Application Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amazon, Google, Kraken"
                  className="w-full bg-[#0e0e0e] border border-[#47483c] px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d] font-mono placeholder:text-[#c8c7b8]/30 transition-all caret-[#ffb77d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#c8c7b8] mb-1">
                    Username / Login Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="User handle, email, ID"
                    className="w-full bg-[#0e0e0e] border border-[#47483c] px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d] font-mono placeholder:text-[#c8c7b8]/30 transition-all caret-[#ffb77d]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#c8c7b8] mb-1 text-left">
                    Vault Category Group
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value as any)}
                    className="w-full bg-[#0e0e0e] border border-[#47483c] px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d] font-mono text-left transition-all"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Social">Social</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#c8c7b8]">
                    Secret Password / Key *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandom}
                    className="text-[10px] font-mono uppercase text-[#c3cc8c] hover:text-[#ffb77d] flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> Quick Gen
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password key..."
                    className="w-full bg-[#0e0e0e] border border-[#47483c] pl-3 pr-10 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d] font-mono placeholder:text-[#c8c7b8]/30 transition-all caret-[#ffb77d]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c8c7b8] hover:text-[#ffb77d]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator inside Form */}
                {password && (
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[#c8c7b8]/60">Cryptic Weight:</span>
                      <span
                        className={`font-bold uppercase tracking-wider ${
                          strength === "Strong"
                            ? "text-[#c3cc8c]"
                            : strength === "Medium"
                              ? "text-[#ffb77d]"
                              : "text-[#ffb4ab]"
                        }`}
                      >
                        {strength}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-24 bg-[#0e0e0e] border border-[#47483c]">
                      <div
                        className={`h-full ${
                          strength === "Weak"
                            ? "w-1/3 bg-[#ffb4ab]"
                            : strength === "Medium"
                              ? "w-2/3 bg-[#ffb77d]"
                              : "w-full bg-[#c3cc8c]"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#c8c7b8] mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#0e0e0e] border border-[#47483c] px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d] font-mono placeholder:text-[#c8c7b8]/30 transition-all caret-[#ffb77d]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#c8c7b8] mb-1">
                  Secure Hieroglyph Notes / Description (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write relevant cave instructions..."
                  rows={2}
                  className="w-full bg-[#0e0e0e] border border-[#47483c] px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ffb77d] focus:ring-1 focus:ring-[#ffb77d] font-mono placeholder:text-[#c8c7b8]/30 transition-all caret-[#ffb77d] resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 border border-[#47483c] bg-[#1c1b1b] hover:bg-[#353534] hover:text-[#ffb77d] py-2.5 font-mono text-[12px] uppercase tracking-wider font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#4b5320] border-2 border-[#c3cc8c] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] py-2.5 font-mono text-[12px] uppercase tracking-wider font-bold transition-all shadow-[0_0_10px_rgba(195,204,140,0.2)] hover:shadow-[0_0_15px_rgba(195,204,140,0.5)] cursor-pointer"
                >
                  {editingCredential ? "Update Chomp Seal" : "Secure In Cave"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
