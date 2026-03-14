import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";

const groups: {
  id: AgeGroup;
  icon: string;
  color: string;
  gradient: string;
  bgGrad: string;
  badgeKey: string;
  desc2Key: string;
}[] = [
  {
    id: "5-10",
    icon: "🧒",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    bgGrad: "linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%)",
    badgeKey: "age.badge1",
    desc2Key: "age.desc2.1",
  },
  {
    id: "11-18",
    icon: "🧑",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
    bgGrad: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)",
    badgeKey: "age.badge2",
    desc2Key: "age.desc2.2",
  },
  {
    id: "18+",
    icon: "👩‍🔬",
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
    bgGrad: "linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)",
    badgeKey: "age.badge3",
    desc2Key: "age.desc2.3",
  },
];

export default function AgeSelection() {
  const { t } = useLanguage();
  const { setPage, setAgeGroup } = useApp();

  const labels: Record<AgeGroup, { title: string; desc: string }> = {
    "5-10":  { title: t("age.group1"), desc: t("age.group1.desc") },
    "11-18": { title: t("age.group2"), desc: t("age.group2.desc") },
    "18+":   { title: t("age.group3"), desc: t("age.group3.desc") },
  };

  const handleSelect = (id: AgeGroup) => {
    setAgeGroup(id);
    setPage("video");
  };

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f0f9ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid #e2e8f0", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(124,58,237,0.1)", color: "#7c3aed",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase",
          }}>
            {t("scene.stepLabel")} 2 / 5
          </span>
          <h1 style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            🎓 {t("age.title")}
          </h1>
        </div>
        <button
          onClick={() => setPage("scene")}
          style={{
            padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
            fontWeight: 600, background: "#f1f5f9", color: "#475569",
            border: "1px solid #e2e8f0", cursor: "pointer",
          }}
        >
          ← {t("age.back")}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <p style={{ color: "#64748b", fontSize: "1rem", margin: 0 }}>
            {t("age.subtitle")}
          </p>
        </motion.div>

        <div style={{ display: "flex", gap: "20px", width: "100%", maxWidth: "960px" }}>
          {groups.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.45, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.04, y: -6, boxShadow: `0 20px 50px ${g.color}30` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(g.id)}
              style={{
                flex: 1,
                background: g.bgGrad,
                border: `2px solid ${g.color}25`,
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.9rem",
                transition: "all 0.25s ease",
                boxShadow: `0 4px 20px ${g.color}15`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative top band */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "5px",
                background: g.gradient,
              }} />

              {/* Badge */}
              <div style={{
                position: "absolute",
                top: "14px", right: "14px",
                background: `${g.color}15`,
                color: g.color,
                fontSize: "0.62rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "20px",
                border: `1px solid ${g.color}30`,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                {t(g.badgeKey)}
              </div>

              {/* Icon circle */}
              <div style={{
                width: "88px", height: "88px", borderRadius: "50%",
                background: "#ffffff",
                boxShadow: `0 4px 20px ${g.color}30`,
                border: `3px solid ${g.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.8rem",
                marginTop: "0.5rem",
              }}>
                {g.icon}
              </div>

              {/* Age title */}
              <div>
                <h2 style={{
                  color: "#1e293b", fontWeight: 800, fontSize: "1.3rem",
                  margin: "0 0 0.35rem", letterSpacing: "-0.01em",
                }}>
                  {labels[g.id].title}
                </h2>
                <p style={{
                  color: "#64748b", fontSize: "0.85rem",
                  lineHeight: 1.5, margin: "0 0 0.4rem",
                }}>
                  {labels[g.id].desc}
                </p>
                <p style={{
                  color: g.color, fontSize: "0.75rem",
                  fontWeight: 600, margin: 0,
                }}>
                  {t(g.desc2Key)}
                </p>
              </div>

              {/* Select button */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                style={{
                  padding: "0.55rem 2rem", borderRadius: "30px",
                  background: g.gradient,
                  color: "#ffffff",
                  fontSize: "0.9rem", fontWeight: 700,
                  marginTop: "0.4rem",
                  boxShadow: `0 4px 16px ${g.color}40`,
                  letterSpacing: "0.01em",
                }}
              >
                {t("age.select")}
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
