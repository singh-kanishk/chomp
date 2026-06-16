import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

export type CustomPromptConfig = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "confirm";
  onConfirm?: () => void;
};

interface CustomPromptProps {
  config: CustomPromptConfig | null;
  onClose: () => void;
}

export function CustomPrompt({ config, onClose }: CustomPromptProps) {
  return (
    <AnimatePresence>
      {config?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="stone-slab border-4 border-[#ffb77d]/50 max-w-sm w-full p-6 relative font-mono text-xs text-[#e5e2e1]"
          >
            {/* Highlight bar header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffb77d]" />

            <h3 className="font-headline text-sm text-[#ffb77d] uppercase tracking-wider mb-3">
              🔱 {config.title}
            </h3>

            <div className="bg-[#0e0e0e] border border-[#47483c] p-3 text-xs text-[#c8c7b8] leading-relaxed rounded-xs whitespace-pre-line mb-5">
              {config.message}
            </div>

            <div className="flex gap-3 justify-end">
              {config.type === "confirm" ? (
                <>
                  <Button
                    onClick={onClose}
                    className="px-4 py-2 border border-[#47483c] bg-[#1c1b1b] text-[#c8c7b8] hover:text-[#ffb77d] hover:border-[#ffb77d] uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                  >
                    Bypass
                  </Button>
                  <Button
                    onClick={() => {
                      if (config.onConfirm) config.onConfirm();
                      onClose();
                    }}
                    className="px-5 py-2 bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#131313] uppercase text-[10px] tracking-wider transition-all font-bold cursor-pointer"
                  >
                    EXECUTE HAMMER
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#4b5320] border border-[#c3cc8c] text-[#bdc787] hover:bg-[#c3cc8c] hover:text-[#2d3404] uppercase text-[10px] tracking-wider transition-all font-bold cursor-pointer"
                >
                  RESOLVE runes
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
