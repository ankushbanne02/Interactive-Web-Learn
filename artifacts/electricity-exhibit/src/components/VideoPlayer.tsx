import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp, AgeGroup } from "@/context/AppContext";

const videoMap: Record<AgeGroup, string> = {
  "5-10": "20Vb6hlLQSg",
  "11-18": "mc979OhitAg",
  "18+": "YQdN5JHj3kE",
};

export default function VideoPlayer() {
  const { t } = useLanguage();
  const { setPage, ageGroup } = useApp();
  const [videoEnded, setVideoEnded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = videoMap[ageGroup ?? "5-10"];
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "onStateChange" && data.info === 0) {
            setVideoEnded(true);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#020817] px-6 py-12">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-700 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-600 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            {t("video.title")}
          </h1>
          <p className="text-xl text-blue-200">{t("video.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10"
          style={{ aspectRatio: "16/9" }}
        >
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Educational Video"
          />
        </motion.div>

        {!videoEnded && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center text-yellow-300 text-lg font-medium"
          >
            ⏰ {t("video.nextHint")}
          </motion.p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={() => setPage("age")}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-lg font-semibold border border-white/20 transition-all"
          >
            ← {t("video.back")}
          </button>

          <motion.button
            whileHover={videoEnded ? { scale: 1.06 } : {}}
            whileTap={videoEnded ? { scale: 0.96 } : {}}
            onClick={() => videoEnded && setPage("game")}
            className={`px-10 py-4 rounded-xl text-xl font-bold transition-all ${
              videoEnded
                ? "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/40 cursor-pointer"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {t("video.next")} →
          </motion.button>
        </div>

        {/* Skip for demo */}
        <div className="mt-4 text-center">
          <button
            onClick={() => { setVideoEnded(true); }}
            className="text-white/30 hover:text-white/60 text-sm underline transition-colors"
          >
            (Skip video for demo)
          </button>
        </div>
      </div>
    </div>
  );
}
