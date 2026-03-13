import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";

const ageGroups: { id: AgeGroup; icon: string; gradient: string; glow: string }[] = [
  {
    id: "5-10",
    icon: "🧒",
    gradient: "from-pink-500 to-rose-400",
    glow: "shadow-pink-500/40",
  },
  {
    id: "11-18",
    icon: "🧑",
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-purple-500/40",
  },
  {
    id: "18+",
    icon: "👩‍🔬",
    gradient: "from-emerald-500 to-cyan-400",
    glow: "shadow-emerald-500/40",
  },
];

export default function AgeSelection() {
  const { t } = useLanguage();
  const { setPage, setAgeGroup } = useApp();

  const handleSelect = (id: AgeGroup) => {
    setAgeGroup(id);
    setPage("video");
  };

  const labels: Record<AgeGroup, { title: string; desc: string }> = {
    "5-10": { title: t("age.group1"), desc: t("age.group1.desc") },
    "11-18": { title: t("age.group2"), desc: t("age.group2.desc") },
    "18+": { title: t("age.group3"), desc: t("age.group3.desc") },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#020817] overflow-hidden px-6 py-12">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 bg-violet-700 opacity-15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-600 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("age.title")}
          </h1>
          <p className="text-xl text-blue-200">{t("age.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ageGroups.map((group, i) => (
            <motion.button
              key={group.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.06, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(group.id)}
              className={`bg-gradient-to-br ${group.gradient} p-8 rounded-3xl shadow-2xl ${group.glow} flex flex-col items-center gap-4 cursor-pointer`}
            >
              <span className="text-7xl">{group.icon}</span>
              <h2 className="text-2xl font-extrabold text-white">
                {labels[group.id].title}
              </h2>
              <p className="text-white/80 text-lg font-medium">
                {labels[group.id].desc}
              </p>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => setPage("scene")}
          className="mt-10 mx-auto block px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-lg font-semibold border border-white/20 transition-all"
        >
          ← {t("age.back")}
        </motion.button>
      </div>
    </div>
  );
}
