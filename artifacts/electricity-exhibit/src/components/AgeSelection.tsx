import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";

const ageGroups: { id: AgeGroup; icon: string; gradient: string; border: string; shadow: string; bg: string }[] = [
  {
    id: "5-10",
    icon: "🧒",
    gradient: "from-pink-500 to-rose-400",
    border: "border-pink-300",
    shadow: "shadow-pink-200",
    bg: "from-pink-50 to-rose-50",
  },
  {
    id: "11-18",
    icon: "🧑",
    gradient: "from-violet-500 to-purple-400",
    border: "border-purple-300",
    shadow: "shadow-purple-200",
    bg: "from-violet-50 to-purple-50",
  },
  {
    id: "18+",
    icon: "👩‍🔬",
    gradient: "from-emerald-500 to-cyan-400",
    border: "border-emerald-300",
    shadow: "shadow-emerald-200",
    bg: "from-emerald-50 to-cyan-50",
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
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: "linear-gradient(135deg, #fef9ff 0%, #f0f9ff 50%, #fefce8 100%)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-200 opacity-40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-200 opacity-40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-5 py-2 shadow-sm border border-purple-100 mb-4">
            <span className="text-purple-500 font-bold text-sm uppercase tracking-wider">Step 2</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            {t("age.title")}
          </h1>
          <p className="text-xl text-gray-500">{t("age.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ageGroups.map((group, i) => (
            <motion.button
              key={group.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(group.id)}
              className={`bg-gradient-to-br ${group.bg} p-8 rounded-3xl shadow-xl ${group.shadow} flex flex-col items-center gap-4 cursor-pointer border-2 ${group.border} hover:shadow-2xl transition-all duration-200`}
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${group.gradient} flex items-center justify-center text-5xl shadow-lg`}>
                {group.icon}
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">
                {labels[group.id].title}
              </h2>
              <p className="text-gray-500 text-lg font-medium text-center">
                {labels[group.id].desc}
              </p>
              <div className={`px-5 py-2 rounded-full bg-gradient-to-br ${group.gradient} text-white font-bold text-sm shadow-md`}>
                Select →
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => setPage("scene")}
          className="mt-10 mx-auto flex items-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-gray-600 rounded-xl text-lg font-semibold border border-gray-200 shadow-sm transition-all hover:shadow-md"
        >
          ← {t("age.back")}
        </motion.button>
      </div>
    </div>
  );
}
