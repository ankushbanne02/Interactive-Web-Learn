import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

export default function GameEmbed() {
  const { t } = useLanguage();
  const { setPage } = useApp();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#f8fafc" }}>
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(245,158,11,0.12)", color: "#d97706",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase"
          }}>
            {t("scene.stepLabel")} 4 / 5
          </span>
          <h1 style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            🎮 {t("game.title")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setPage("video")}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 600, background: "#f1f5f9", color: "#475569",
              border: "1px solid #e2e8f0", cursor: "pointer"
            }}
          >
            ← {t("game.back")}
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPage("quiz")}
            style={{
              padding: "0.5rem 1.5rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "#ffffff", border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)"
            }}
          >
            {t("game.next")}
          </motion.button>
        </div>
      </div>

      {/* Game iframe */}
      <div className="flex-1 min-h-0">
        <iframe
          src="https://spark-city-adventure.vercel.app/"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title="Spark City Adventure"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen"
        />
      </div>
    </div>
  );
}
