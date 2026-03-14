import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import confetti from "canvas-confetti";

export default function RewardScreen() {
  const { t } = useLanguage();
  const { score, setPage, setScore } = useApp();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const end = Date.now() + 3500;
    const colors = ["#7c3aed", "#2563eb", "#f59e0b", "#10b981", "#ec4899"];
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleRestart = () => {
    setScore(0);
    setPage("landing");
  };

  const getMessage = () => {
    if (score >= 4) return t("reward.excellent");
    if (score >= 2) return t("reward.good");
    return t("reward.keep");
  };

  const scoreColor = score >= 4 ? "#10b981" : score >= 2 ? "#7c3aed" : "#f59e0b";
  const scoreBg = score >= 4 ? "rgba(16,185,129,0.08)" : score >= 2 ? "rgba(124,58,237,0.08)" : "rgba(245,158,11,0.08)";
  const scoreBorder = score >= 4 ? "rgba(16,185,129,0.3)" : score >= 2 ? "rgba(124,58,237,0.3)" : "rgba(245,158,11,0.3)";

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(145deg, #f0f9ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${scoreColor}10 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: "1.5rem", padding: "2rem",
        maxWidth: "560px", width: "100%",
      }}>
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -120 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 12 }}
          style={{ fontSize: "5rem", lineHeight: 1 }}
        >
          🏆
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ color: "#1e293b", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}
        >
          {t("reward.title")}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}
        >
          {t("reward.message")}
        </motion.p>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          style={{
            background: scoreBg,
            border: `1.5px solid ${scoreBorder}`,
            borderRadius: "14px",
            padding: "1.5rem 3rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ color: scoreColor, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            {t("reward.score")}
          </p>
          <p style={{ color: "#1e293b", fontSize: "4rem", fontWeight: 800, lineHeight: 1, margin: 0 }}>
            {score}<span style={{ fontSize: "1.5rem", color: "#94a3b8", fontWeight: 500 }}> / 5</span>
          </p>
        </motion.div>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{ display: "flex", gap: "0.5rem" }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.65 + i * 0.08, type: "spring", stiffness: 220 }}
              style={{
                fontSize: "2.2rem",
                filter: i <= score ? "drop-shadow(0 0 6px rgba(251,191,36,0.7))" : "grayscale(1) opacity(0.25)",
              }}
            >⭐</motion.span>
          ))}
        </motion.div>

        {/* Performance label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{
            padding: "0.65rem 1.5rem",
            borderRadius: "8px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ color: "#334155", fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>
            {getMessage()}
          </p>
        </motion.div>

        {/* Restart button */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRestart}
          style={{
            padding: "0.9rem 3rem",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            color: "#ffffff", fontWeight: 700, fontSize: "1.05rem",
            borderRadius: "10px", border: "none", cursor: "pointer",
            boxShadow: "0 6px 24px rgba(124,58,237,0.35)",
          }}
        >
          🚀 {t("reward.restart")}
        </motion.button>
      </div>
    </div>
  );
}
