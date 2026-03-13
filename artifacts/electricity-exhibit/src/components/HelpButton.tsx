import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function HelpButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 text-white rounded-full shadow-2xl shadow-violet-300/60 text-2xl font-extrabold flex items-center justify-center border-4 border-white"
        style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
      >
        ?
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="fixed bottom-28 right-8 z-50 bg-white rounded-3xl p-6 shadow-2xl shadow-violet-200 max-w-xs w-full border border-violet-100"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow">
                  ?
                </div>
                <h3 className="text-xl font-extrabold text-gray-800">{t("help.title")}</h3>
              </div>
              <ul className="space-y-3 mb-5">
                {["help.tip1", "help.tip2", "help.tip3"].map((key, i) => (
                  <li key={key} className="flex items-start gap-3 bg-purple-50 rounded-xl p-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{t(key)}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 text-white font-bold rounded-xl shadow-md transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
              >
                {t("help.close")} ✓
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
