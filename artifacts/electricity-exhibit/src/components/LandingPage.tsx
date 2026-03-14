import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

const floatingIcons = [
  { icon: "⚡", x: "7%",  y: "12%", size: "2.2rem", delay: 0 },
  { icon: "💡", x: "87%", y: "10%", size: "2rem",   delay: 0.4 },
  { icon: "🔋", x: "4%",  y: "70%", size: "1.8rem", delay: 0.8 },
  { icon: "🌊", x: "90%", y: "65%", size: "2.1rem", delay: 0.2 },
  { icon: "⚙️", x: "17%", y: "83%", size: "1.9rem", delay: 1.1 },
  { icon: "🏭", x: "77%", y: "80%", size: "1.8rem", delay: 0.6 },
  { icon: "🔌", x: "49%", y: "6%",  size: "1.7rem", delay: 1.4 },
  { icon: "🌞", x: "21%", y: "20%", size: "2rem",   delay: 0.9 },
  { icon: "🏠", x: "62%", y: "88%", size: "1.7rem", delay: 1.2 },
  { icon: "⚡", x: "35%", y: "78%", size: "1.5rem", delay: 0.3 },
];

const steps = [
  { icon: "🔬", label: "3D Model",  color: "#7c3aed" },
  { icon: "🎬", label: "Video",     color: "#2563eb" },
  { icon: "🎮", label: "Game",      color: "#0891b2" },
  { icon: "🧠", label: "Quiz",      color: "#059669" },
  { icon: "🏆", label: "Reward",    color: "#d97706" },
];

export default function LandingPage() {
  const { t, setLanguage, language } = useLanguage();
  const { setPage } = useApp();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #e0f2fe 0%, #f0fdf4 40%, #fefce8 100%)" }}
    >
      {/* Top gradient decoration */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 70%)",
      }} />

      {/* Floating emoji icons */}
      {floatingIcons.map((p, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: p.x, top: p.y, fontSize: p.size, opacity: 0.35 }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.5 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        >
          {p.icon}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center px-10 py-10"
        style={{
          maxWidth: "640px",
          width: "100%",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        {/* Lightning bolt */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: "4.5rem", lineHeight: 1, marginBottom: "1.2rem" }}
        >
          ⚡
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            color: "#1e293b",
            lineHeight: 1.2,
            marginBottom: "0.6rem",
            letterSpacing: "-0.02em",
          }}
        >
          {t("landing.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: "clamp(0.88rem, 1.6vw, 1.05rem)",
            color: "#64748b",
            lineHeight: 1.6,
            marginBottom: "0.4rem",
          }}
        >
          {t("landing.subtitle")}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: "0.88rem",
            color: "#7c3aed",
            fontWeight: 700,
            marginBottom: "1.8rem",
            background: "rgba(124,58,237,0.08)",
            padding: "0.3rem 1rem",
            borderRadius: "20px",
            border: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          🚀 {t("landing.tagline")}
        </motion.p>

        {/* Language selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ marginBottom: "1.75rem", width: "100%" }}
        >
          <p style={{
            color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.65rem",
          }}>
            {t("landing.selectLang")}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            {([
              { code: "en" as const, label: "🇬🇧  English" },
              { code: "mr" as const, label: "🇮🇳  मराठी" },
            ]).map(({ code, label }) => (
              <motion.button
                key={code}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLanguage(code)}
                style={{
                  padding: "0.6rem 1.75rem",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  border: language === code ? "2px solid #7c3aed" : "2px solid #e2e8f0",
                  background: language === code ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "#f8fafc",
                  color: language === code ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: language === code ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
                }}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Explore button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage("scene")}
          style={{
            width: "100%",
            maxWidth: "340px",
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "1.1rem",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 28px rgba(124,58,237,0.38)",
            letterSpacing: "0.01em",
            marginBottom: "2rem",
          }}
        >
          {t("landing.explore")} →
        </motion.button>

        {/* Journey steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center" }}
        >
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                width: "64px",
              }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: `${s.color}12`, border: `2px solid ${s.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.1rem",
                }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: "20px", height: "2px", marginBottom: "14px",
                  background: "linear-gradient(90deg, #e2e8f0, #c7d2fe)",
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
