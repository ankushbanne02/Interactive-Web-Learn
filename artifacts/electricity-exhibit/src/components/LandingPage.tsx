import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

const particles = [
  { icon: "⚡", x: "8%", y: "15%", size: "2rem", delay: 0 },
  { icon: "💡", x: "88%", y: "12%", size: "1.8rem", delay: 0.4 },
  { icon: "🔋", x: "5%", y: "72%", size: "1.6rem", delay: 0.8 },
  { icon: "🌊", x: "91%", y: "68%", size: "1.9rem", delay: 0.2 },
  { icon: "⚙️", x: "18%", y: "85%", size: "1.7rem", delay: 1.1 },
  { icon: "🏭", x: "78%", y: "82%", size: "1.6rem", delay: 0.6 },
  { icon: "🔌", x: "50%", y: "8%", size: "1.5rem", delay: 1.4 },
  { icon: "🌞", x: "22%", y: "22%", size: "1.8rem", delay: 0.9 },
];

export default function LandingPage() {
  const { t, setLanguage, language } = useLanguage();
  const { setPage } = useApp();

  const handleLangSelect = (lang: "en" | "mr") => {
    setLanguage(lang);
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0c4a6e 100%)",
      }}
    >
      {/* Subtle radial glow in center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Floating icons */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: p.x, top: p.y, fontSize: p.size, opacity: 0.18 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        >
          {p.icon}
        </motion.div>
      ))}

      {/* Main content — no card, direct on background */}
      <div className="relative z-10 flex flex-col items-center text-center px-8" style={{ maxWidth: "640px" }}>
        {/* Lightning bolt */}
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: "4.5rem", lineHeight: 1, marginBottom: "1.5rem" }}
        >
          ⚡
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.2,
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          {t("landing.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.6,
            marginBottom: "0.5rem",
            fontWeight: 400,
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
            fontSize: "0.9rem",
            color: "#fbbf24",
            fontWeight: 600,
            marginBottom: "2.5rem",
            letterSpacing: "0.02em",
          }}
        >
          🚀 {t("landing.tagline")}
        </motion.p>

        {/* Language selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ marginBottom: "2rem", width: "100%" }}
        >
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            {t("landing.selectLang")}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            {[
              { code: "en" as const, label: "🇬🇧  English" },
              { code: "mr" as const, label: "🇮🇳  मराठी" },
            ].map(({ code, label }) => (
              <motion.button
                key={code}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleLangSelect(code)}
                style={{
                  padding: "0.65rem 1.75rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: language === code ? "2px solid #7c3aed" : "2px solid rgba(255,255,255,0.15)",
                  background: language === code ? "rgba(124,58,237,0.85)" : "rgba(255,255,255,0.07)",
                  color: language === code ? "#ffffff" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backdropFilter: "blur(8px)",
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
            maxWidth: "360px",
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "1.15rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
            letterSpacing: "0.01em",
          }}
        >
          {t("landing.explore")} →
        </motion.button>

        {/* Step indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem", alignItems: "center" }}
        >
          {["🔬 3D Model", "🎬 Video", "🎮 Game", "🧠 Quiz", "🏆 Reward"].map((label, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", fontWeight: 500, whiteSpace: "nowrap" }}>{label}</span>
              {i < 4 && (
                <span style={{ position: "absolute", display: "none" }}>→</span>
              )}
            </div>
          ))}
        </motion.div>
        {/* Step connector line */}
        <div style={{ display: "flex", alignItems: "center", marginTop: "0.4rem", gap: "0" }}>
          {[0,1,2,3,4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(124,58,237,0.6)" }} />
              {i < 4 && <div style={{ width: "32px", height: "1px", background: "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
