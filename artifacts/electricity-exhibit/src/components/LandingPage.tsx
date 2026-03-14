import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

const floatingIcons = [
  { icon: "⚡", x: "4%",  y: "9%",  size: "2rem",   delay: 0,   dur: 3.6 },
  { icon: "💡", x: "88%", y: "8%",  size: "1.8rem",  delay: 0.4, dur: 4.0 },
  { icon: "🔋", x: "2%",  y: "50%", size: "1.7rem",  delay: 0.8, dur: 3.8 },
  { icon: "🌊", x: "92%", y: "46%", size: "1.9rem",  delay: 0.2, dur: 4.2 },
  { icon: "⚙️", x: "3%",  y: "85%", size: "1.8rem",  delay: 1.1, dur: 3.5 },
  { icon: "🏭", x: "89%", y: "84%", size: "1.7rem",  delay: 0.6, dur: 4.1 },
  { icon: "🌞", x: "14%", y: "5%",  size: "1.9rem",  delay: 0.9, dur: 3.7 },
  { icon: "🏠", x: "78%", y: "5%",  size: "1.7rem",  delay: 1.3, dur: 4.3 },
];

const stepDefs = [
  { icon: "🔬", key: "step.model",  color: "#7c3aed" },
  { icon: "🎬", key: "step.video",  color: "#2563eb" },
  { icon: "🎮", key: "step.game",   color: "#0891b2" },
  { icon: "🧠", key: "step.quiz",   color: "#059669" },
  { icon: "🏆", key: "step.reward", color: "#d97706" },
];

export default function LandingPage() {
  const { t, setLanguage, language } = useLanguage();
  const { setPage } = useApp();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #dbeafe 0%, #ede9fe 45%, #fce7f3 100%)" }}
    >
      {/* Soft radial glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 40% at 50% 100%, rgba(37,99,235,0.08) 0%, transparent 70%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 40% 35% at 90% 50%, rgba(236,72,153,0.07) 0%, transparent 70%)",
      }} />

      {/* Floating icons */}
      {floatingIcons.map((p, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: p.x, top: p.y, fontSize: p.size, opacity: 0.3 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        >
          {p.icon}
        </motion.div>
      ))}

      {/* Glassmorphism card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          maxWidth: "590px",
          width: "100%",
          padding: "2.4rem 2.5rem 2rem",
          background: "rgba(255,255,255,0.62)",
          backdropFilter: "blur(18px)",
          border: "1.5px solid rgba(255,255,255,0.85)",
          borderRadius: "28px",
          boxShadow: "0 8px 40px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
          margin: "0 1rem",
        }}
      >
        {/* Glowing lightning bolt */}
        <div style={{ position: "relative", marginBottom: "0.9rem" }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: "-18px",
              background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(8px)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "3.8rem", lineHeight: 1, position: "relative", zIndex: 1 }}
          >
            ⚡
          </motion.div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          style={{
            fontSize: "clamp(1.9rem, 4.2vw, 2.9rem)",
            fontWeight: 900,
            color: "#1e293b",
            lineHeight: 1.15,
            marginBottom: "0.65rem",
            letterSpacing: "-0.02em",
          }}
        >
          {t("landing.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          style={{
            fontSize: "clamp(0.88rem, 1.5vw, 1rem)",
            color: "#64748b",
            lineHeight: 1.6,
            marginBottom: "0.4rem",
            maxWidth: "410px",
          }}
        >
          {t("landing.subtitle")}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          style={{
            fontSize: "0.86rem",
            color: "#ea580c",
            fontWeight: 700,
            marginBottom: "1.5rem",
          }}
        >
          {t("landing.tagline")}
        </motion.p>

        {/* Language selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4 }}
          style={{ marginBottom: "1.1rem", width: "100%" }}
        >
          <p style={{
            color: "#94a3b8", fontSize: "0.67rem", fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.6rem",
          }}>
            {t("landing.selectLang")}
          </p>
          <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center" }}>
            {([
              { code: "en" as const, label: "🇬🇧  English" },
              { code: "mr" as const, label: "🇮🇳  मराठी" },
            ]).map(({ code, label }) => (
              <motion.button
                key={code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setLanguage(code)}
                style={{
                  padding: "0.55rem 1.65rem",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  border: language === code ? "2px solid #7c3aed" : "2px solid #cbd5e1",
                  background: language === code
                    ? "linear-gradient(135deg, #7c3aed, #2563eb)"
                    : "rgba(255,255,255,0.75)",
                  color: language === code ? "#ffffff" : "#475569",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: language === code ? "0 4px 16px rgba(124,58,237,0.3)" : "none",
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
          transition={{ delay: 0.54, duration: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage("scene")}
          style={{
            width: "100%",
            maxWidth: "340px",
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "1.1rem",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 28px rgba(124,58,237,0.38)",
            letterSpacing: "0.02em",
            marginBottom: "1.6rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shimmer sweep */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              transform: "skewX(-15deg)",
            }}
          />
          <span style={{ position: "relative", zIndex: 1 }}>
            {t("landing.explore")} →
          </span>
        </motion.button>

        {/* Journey steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "100%" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center" }}>
            {stepDefs.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                  width: "64px",
                }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: `${s.color}14`,
                    border: `2px solid ${s.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem",
                    boxShadow: `0 2px 8px ${s.color}20`,
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {t(s.key)}
                  </span>
                </div>
                {i < stepDefs.length - 1 && (
                  <div style={{
                    width: "20px", height: "2px", marginBottom: "16px",
                    background: "linear-gradient(90deg, #c7d2fe, #e0e7ff)",
                    flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>
          {/* Progress dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {stepDefs.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: s.color,
                  opacity: 0.75,
                }} />
                {i < stepDefs.length - 1 && (
                  <div style={{ width: "52px", height: "2px", background: "linear-gradient(90deg, #c7d2fe, #e0e7ff)" }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
