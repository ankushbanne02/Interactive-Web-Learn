import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";
import { motion } from "framer-motion";

const videoMap: Record<AgeGroup, string> = {
  "5-10": "20Vb6hlLQSg",
  "11-18": "mc979OhitAg",
  "18+": "YQdN5JHj3kE",
};

const ageBadge: Record<AgeGroup, { label: string; color: string }> = {
  "5-10": { label: "Ages 5–10 🧒", color: "#ec4899" },
  "11-18": { label: "Ages 11–18 🧑", color: "#7c3aed" },
  "18+": { label: "Ages 18+ 👩‍🔬", color: "#10b981" },
};

export default function VideoPlayer() {
  const { t } = useLanguage();
  const { setPage, ageGroup } = useApp();

  const videoId = videoMap[ageGroup ?? "5-10"];
  const badge = ageBadge[ageGroup ?? "5-10"];
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#0f172a" }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.95)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(124,58,237,0.25)", color: "#a78bfa",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase"
          }}>
            Step 3 / 5
          </span>
          <h1 style={{ color: "#f1f5f9", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            🎬 {t("video.title")}
          </h1>
          <span style={{
            padding: "0.2rem 0.75rem", borderRadius: "20px",
            background: `${badge.color}22`, color: badge.color,
            fontSize: "0.78rem", fontWeight: 600, border: `1px solid ${badge.color}40`,
          }}>
            {badge.label}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setPage("age")}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 600, background: "rgba(255,255,255,0.07)", color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer"
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
              boxShadow: "0 4px 14px rgba(124,58,237,0.4)"
            }}
          >
            {t("video.next")} →
          </motion.button>
        </div>
      </div>

      {/* Subtitle */}
      <div className="shrink-0 px-8 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>{t("video.subtitle")}</p>
      </div>

      {/* Video — fills remaining space */}
      <div className="flex-1 min-h-0 p-6">
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#000",
          }}
        >
          <iframe
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
