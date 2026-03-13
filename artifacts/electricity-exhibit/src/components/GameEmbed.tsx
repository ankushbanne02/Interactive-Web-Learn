import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

export default function GameEmbed() {
  const { t } = useLanguage();
  const { setPage } = useApp();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#020817]">
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#020817]/80 backdrop-blur border-b border-white/10">
          <button
            onClick={() => setPage("video")}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-all"
          >
            ← {t("game.back")}
          </button>

          <h1 className="text-xl md:text-2xl font-extrabold text-white text-center flex-1 mx-4">
            ⚡ {t("game.title")}
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage("quiz")}
            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg font-bold shadow-lg shadow-yellow-400/30 transition-all"
          >
            {t("game.next")}
          </motion.button>
        </div>

        {/* Game iframe */}
        <div className="flex-1 relative">
          <iframe
            src="https://spark-city-adventure.vercel.app/"
            className="w-full h-full border-0"
            title="Spark City Adventure Game"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
