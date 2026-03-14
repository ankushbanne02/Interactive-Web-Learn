import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";

const groups: { id: AgeGroup; icon: string; color: string; bg: string; border: string }[] = [
  { id: "5-10", icon: "🧒", color: "#ec4899", bg: "rgba(236,72,153,0.07)", border: "rgba(236,72,153,0.3)" },
  { id: "11-18", icon: "🧑", color: "#7c3aed", bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.3)" },
  { id: "18+", icon: "👩‍🔬", color: "#10b981", bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.3)" },
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
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase"
          }}>
            Step 2 / 5
          </span>
          <h1 style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            {t("age.title")}
          </h1>
        </div>
        <button
          onClick={() => setPage("scene")}
          style={{
            padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
            fontWeight: 600, background: "#f1f5f9", color: "#475569",
            border: "1px solid #e2e8f0", cursor: "pointer"
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
          style={{ color: "#64748b", fontSize: "1rem", marginBottom: "2.5rem", textAlign: "center" }}
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
                background: "#ffffff",
                border: `1.5px solid ${g.border}`,
                borderRadius: "14px",
                padding: "2.5rem 1.5rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                transition: "all 0.2s",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: g.bg, border: `2px solid ${g.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem",
              }}>
                {g.icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ color: "#1e293b", fontWeight: 700, fontSize: "1.2rem", margin: "0 0 0.4rem" }}>
                  {labels[g.id].title}
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>
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
