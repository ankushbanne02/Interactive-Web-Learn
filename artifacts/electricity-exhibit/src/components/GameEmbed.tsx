import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

export default function GameEmbed() {
  const { t } = useLanguage();
  const { setPage } = useApp();

  return (
    <div className="relative h-screen flex flex-col bg-white">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shadow-sm"
        style={{ background: "linear-gradient(90deg, #f0f9ff, #fef3c7)" }}
      >
        <button
          onClick={() => setPage("video")}
          className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-600 rounded-xl font-semibold border border-gray-200 shadow-sm transition-all hover:shadow-md flex items-center gap-2"
        >
          ← {t("game.back")}
        </button>

        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-1 border border-yellow-200 mb-0.5">
            <span className="text-yellow-600 font-bold text-xs uppercase tracking-wider">Step 4</span>
          </div>
          <h1 className="text-base md:text-lg font-extrabold text-gray-800 text-center">
            ⚡ {t("game.title")}
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage("quiz")}
          className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all text-sm"
        >
          {t("game.next")}
        </motion.button>
      </div>

      {/* Game iframe */}
      <div className="flex-1 relative bg-gray-50">
        <iframe
          src="https://spark-city-adventure.vercel.app/"
          className="w-full h-full border-0"
          title="Spark City Adventure Game"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen"
        />
      </div>
    </div>
  );
}
