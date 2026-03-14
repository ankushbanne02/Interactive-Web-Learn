import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

const floatingIcons = [
  { icon: "⚡", x: "3%",  y: "8%",  size: "1.7rem", delay: 0 },
  { icon: "💡", x: "90%", y: "7%",  size: "1.5rem", delay: 0.4 },
  { icon: "🔋", x: "2%",  y: "46%", size: "1.5rem", delay: 0.8 },
  { icon: "🌊", x: "93%", y: "44%", size: "1.6rem", delay: 0.2 },
  { icon: "⚙️", x: "4%",  y: "86%", size: "1.5rem", delay: 1.1 },
  { icon: "🏭", x: "90%", y: "85%", size: "1.5rem", delay: 0.6 },
  { icon: "🌞", x: "13%", y: "4%",  size: "1.6rem", delay: 0.9 },
  { icon: "🏠", x: "80%", y: "4%",  size: "1.5rem", delay: 1.3 },
];

const stepDefs = [
  { icon: "🔬", key: "step.model",  color: "#7c3aed" },
  { icon: "🎬", key: "step.video",  color: "#2563eb" },
  { icon: "🎮", key: "step.game",   color: "#0891b2" },
  { icon: "🧠", key: "step.quiz",   color: "#059669" },
  { icon: "🏆", key: "step.reward", color: "#d97706" },
];

const stepColors = ["#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706"];

export default function LandingPage() {
  const { t, setLanguage, language } = useLanguage();
  const { setPage } = useApp();

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #dbeafe 0%, #ede9fe 45%, #fce7f3 100%)" }}
    >
      {/* Radial glow at top */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.13) 0%, transparent 70%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(37,99,235,0.07) 0%, transparent 70%)",
      }} />

      {/* Floating corner icons */}
      {floatingIcons.map((p, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: p.x, top: p.y, fontSize: p.size, opacity: 0.28 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        >
          {p.icon}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center"
        style={{ maxWidth: "580px", width: "100%", padding: "0 2rem" }}
      >
        {/* Big lightning bolt */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: "3.6rem", lineHeight: 1, marginBottom: "1rem" }}
        >
          ⚡
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            fontWeight: 900,
            color: "#1e293b",
            lineHeight: 1.15,
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          {t("landing.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
            color: "#64748b",
            lineHeight: 1.55,
            marginBottom: "0.5rem",
            maxWidth: "400px",
          }}
        >
          {t("landing.subtitle")}
        </motion.p>

        {/* Tagline — plain colored text, no pill */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: "0.88rem",
            color: "#ea580c",
            fontWeight: 700,
            marginBottom: "1.8rem",
          }}
        >
          {t("landing.tagline")}
        </motion.p>

        {/* Language selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ marginBottom: "1.25rem", width: "100%" }}
        >
          <p style={{
            color: "#94a3b8", fontSize: "0.68rem", fontWeight: 700,
            letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: "0.6rem",
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
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLanguage(code)}
                style={{
                  padding: "0.55rem 1.6rem",
                  borderRadius: "10px",
                  fontSize: "0.97rem",
                  fontWeight: 700,
                  border: language === code ? "2px solid #7c3aed" : "2px solid #cbd5e1",
                  background: language === code ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "rgba(255,255,255,0.7)",
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.52, duration: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.04, y: -2 }}
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
            boxShadow: "0 8px 28px rgba(124,58,237,0.35)",
            letterSpacing: "0.01em",
            marginBottom: "1.8rem",
          }}
        >
          {t("landing.explore")} →
        </motion.button>

        {/* Journey steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.72 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "100%" }}
        >
          {/* Step icons row */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center" }}>
            {stepDefs.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                  width: "62px",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: `${s.color}14`, border: `2px solid ${s.color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem",
                  }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {t(s.key)}
                  </span>
                </div>
                {i < stepDefs.length - 1 && (
                  <div style={{
                    width: "18px", height: "2px", marginBottom: "16px",
                    background: "linear-gradient(90deg, #e2e8f0, #c7d2fe)",
                    flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Progress dots row */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {stepDefs.map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: stepColors[i],
                  opacity: 0.7,
                }} />
                {i < stepDefs.length - 1 && (
                  <div style={{ width: "54px", height: "2px", background: "linear-gradient(90deg, #c7d2fe, #e2e8f0)" }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
