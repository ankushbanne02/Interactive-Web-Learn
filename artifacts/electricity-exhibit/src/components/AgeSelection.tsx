import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";

const groups: { id: AgeGroup; icon: string; color: string; bg: string; border: string }[] = [
  { id: "5-10", icon: "🧒", color: "#ec4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.35)" },
  { id: "11-18", icon: "🧑", color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.35)" },
  { id: "18+", icon: "👩‍🔬", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.35)" },
];

export default function AgeSelection() {
  const { t } = useLanguage();
  const { setPage, setAgeGroup } = useApp();

  const labels: Record<AgeGroup, { title: string; desc: string }> = {
    "5-10": { title: t("age.group1"), desc: t("age.group1.desc") },
    "11-18": { title: t("age.group2"), desc: t("age.group2.desc") },
    "18+": { title: t("age.group3"), desc: t("age.group3.desc") },
  };

  const handleSelect = (id: AgeGroup) => {
    setAgeGroup(id);
    setPage("video");
  };

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 60%, #0c2340 100%)" }}
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
            Step 2 / 5
          </span>
          <h1 style={{ color: "#f1f5f9", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            {t("age.title")}
          </h1>
        </div>
        <button
          onClick={() => setPage("scene")}
          style={{
            padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
            fontWeight: 600, background: "rgba(255,255,255,0.07)", color: "#94a3b8",
            border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer"
          }}
        >
          ← {t("age.back")}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 min-h-0">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: "#94a3b8", fontSize: "1rem", marginBottom: "2.5rem", textAlign: "center" }}
        >
          {t("age.subtitle")}
        </motion.p>

        <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "900px" }}>
          {groups.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(g.id)}
              style={{
                flex: 1,
                background: g.bg,
                border: `1.5px solid ${g.border}`,
                borderRadius: "14px",
                padding: "2.5rem 1.5rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: `${g.color}22`, border: `2px solid ${g.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem",
              }}>
                {g.icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.2rem", margin: "0 0 0.4rem" }}>
                  {labels[g.id].title}
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
                  {labels[g.id].desc}
                </p>
              </div>
              <div style={{
                padding: "0.45rem 1.5rem", borderRadius: "20px",
                background: g.color, color: "#ffffff",
                fontSize: "0.85rem", fontWeight: 700, marginTop: "0.5rem",
              }}>
                Select →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
