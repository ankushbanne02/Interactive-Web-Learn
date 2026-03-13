import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function HelpButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-cyan-500 to-violet-600 text-white rounded-full shadow-2xl shadow-cyan-500/40 text-3xl flex items-center justify-center border-2 border-white/20"
      >
        ?
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-28 right-8 z-50 bg-[#0f1629] border border-white/20 rounded-3xl p-6 shadow-2xl max-w-xs w-full"
          >
            <h3 className="text-xl font-extrabold text-white mb-4">
              {t("help.title")} 💡
            </h3>
            <ul className="space-y-3">
              {["help.tip1", "help.tip2", "help.tip3"].map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="text-cyan-400 text-xl">✓</span>
                  <span className="text-white/80 text-base">{t(key)}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpen(false)}
              className="mt-5 w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold rounded-xl"
            >
              {t("help.close")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
