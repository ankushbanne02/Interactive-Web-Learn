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
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 50,
          width: "48px", height: "48px",
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          color: "#ffffff", fontWeight: 800, fontSize: "1.2rem",
          borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
        }}
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
              onClick={() => setOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 40,
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              style={{
                position: "fixed", bottom: "84px", right: "24px", zIndex: 50,
                background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px", padding: "20px", width: "280px",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: "rgba(124,58,237,0.3)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "#a78bfa", fontWeight: 800, fontSize: "0.9rem",
                }}>?</div>
                <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>
                  {t("help.title")}
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {["help.tip1", "help.tip2", "help.tip3"].map((key, i) => (
                  <div
                    key={key}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      background: "rgba(255,255,255,0.04)", borderRadius: "8px",
                      padding: "10px 12px",
                    }}
                  >
                    <span style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "rgba(124,58,237,0.35)", color: "#a78bfa",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.72rem", fontWeight: 700, flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      {t(key)}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "100%", padding: "0.6rem",
                  background: "rgba(124,58,237,0.3)", color: "#a78bfa",
                  border: "1px solid rgba(124,58,237,0.4)", borderRadius: "8px",
                  fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
                }}
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
