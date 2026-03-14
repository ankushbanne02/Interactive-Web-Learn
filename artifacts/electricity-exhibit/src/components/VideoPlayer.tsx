import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";
import { motion } from "framer-motion";

// English videos per age group
const videoMapEn: Record<AgeGroup, string> = {
  "5-10":  "20Vb6hlLQSg",
  "11-18": "mc979OhitAg",
  "18+":   "YQdN5JHj3kE",
};

// Marathi video — same educational video shown for all age groups
// Update these IDs with age-specific Marathi videos when available
const videoMapMr: Record<AgeGroup, string> = {
  "5-10":  "FKKAz_wQGFE",
  "11-18": "FKKAz_wQGFE",
  "18+":   "FKKAz_wQGFE",
};

const ageBadge: Record<AgeGroup, { label: string; color: string }> = {
  "5-10":  { label: "Ages 5–10 🧒",  color: "#ec4899" },
  "11-18": { label: "Ages 11–18 🧑", color: "#7c3aed" },
  "18+":   { label: "Ages 18+ 👩‍🔬",  color: "#10b981" },
};

export default function VideoPlayer() {
  const { t, language } = useLanguage();
  const { setPage, ageGroup } = useApp();

  const age = ageGroup ?? "5-10";
  const videoId = language === "mr" ? videoMapMr[age] : videoMapEn[age];
  const badge = ageBadge[age];
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#f8fafc" }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(124,58,237,0.1)", color: "#7c3aed",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase",
          }}>
            Step 3 / 5
          </span>
          <h1 style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            🎬 {t("video.title")}
          </h1>
          <span style={{
            padding: "0.2rem 0.75rem", borderRadius: "20px",
            background: `${badge.color}15`, color: badge.color,
            fontSize: "0.78rem", fontWeight: 600, border: `1px solid ${badge.color}35`,
          }}>
            {badge.label}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setPage("age")}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 600, background: "#f1f5f9", color: "#475569",
              border: "1px solid #e2e8f0", cursor: "pointer",
            }}
          >
            ← {t("video.back")}
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPage("game")}
            style={{
              padding: "0.5rem 1.5rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "#ffffff", border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            }}
          >
            {t("video.next")} →
          </motion.button>
        </div>
      </div>

      {/* Subtitle */}
      <div className="shrink-0 px-8 py-3" style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
        <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>{t("video.subtitle")}</p>
      </div>

      {/* Video */}
      <div className="flex-1 min-h-0 p-6">
        <div style={{
          width: "100%", height: "100%",
          borderRadius: "14px", overflow: "hidden",
          border: "1px solid #e2e8f0", background: "#000",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        }}>
          <iframe
            key={videoId}
            src={embedUrl}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Educational Video"
          />
        </div>
      </div>
    </div>
  );
}
