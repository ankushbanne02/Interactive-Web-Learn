import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";

const videoMap: Record<AgeGroup, string> = {
  "5-10": "20Vb6hlLQSg",
  "11-18": "mc979OhitAg",
  "18+": "YQdN5JHj3kE",
};

const ageBadge: Record<AgeGroup, { label: string; color: string }> = {
  "5-10": { label: "Ages 5–10 🧒", color: "from-pink-500 to-rose-400" },
  "11-18": { label: "Ages 11–18 🧑", color: "from-violet-500 to-purple-400" },
  "18+": { label: "Ages 18+ 👩‍🔬", color: "from-emerald-500 to-cyan-400" },
};

export default function VideoPlayer() {
  const { t } = useLanguage();
  const { setPage, ageGroup } = useApp();
  const [videoEnded, setVideoEnded] = useState(false);

  const videoId = videoMap[ageGroup ?? "5-10"];
  const badge = ageBadge[ageGroup ?? "5-10"];
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "onStateChange" && data.info === 0) {
            setVideoEnded(true);
          }
        } catch { }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #fef3c7 50%, #fce7f3 100%)" }}
    >
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 opacity-40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-200 opacity-40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-5 py-2 shadow-sm border border-blue-100 mb-3">
            <span className="text-blue-500 font-bold text-sm uppercase tracking-wider">Step 3</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
            {t("video.title")} 🎬
          </h1>
          <p className="text-xl text-gray-500 mb-3">{t("video.subtitle")}</p>
          <span className={`inline-block px-5 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold text-sm shadow-md`}>
            {badge.label}
          </span>
        </motion.div>

        {/* Video card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl shadow-blue-100 overflow-hidden border border-blue-100"
          style={{ aspectRatio: "16/9" }}
        >
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Educational Video"
          />
        </motion.div>

        {!videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3"
          >
            <span className="text-2xl">⏰</span>
            <p className="text-amber-700 text-lg font-semibold">{t("video.nextHint")}</p>
          </motion.div>
        )}

        {videoEnded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-6 py-3"
          >
            <span className="text-2xl">✅</span>
            <p className="text-green-700 text-lg font-semibold">Video complete! Ready to continue!</p>
          </motion.div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={() => setPage("age")}
            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-600 rounded-xl text-lg font-semibold border border-gray-200 shadow-sm transition-all hover:shadow-md"
          >
            ← {t("video.back")}
          </button>

          <motion.button
            whileHover={videoEnded ? { scale: 1.05, y: -2 } : {}}
            whileTap={videoEnded ? { scale: 0.97 } : {}}
            onClick={() => videoEnded && setPage("game")}
            className={`px-10 py-4 rounded-xl text-xl font-bold transition-all shadow-lg ${
              videoEnded
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald-200 hover:shadow-xl cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {t("video.next")} →
          </motion.button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={() => setVideoEnded(true)}
            className="text-gray-400 hover:text-gray-600 text-sm underline transition-colors"
          >
            (Skip video for demo)
          </button>
        </div>
      </div>
    </div>
  );
}
