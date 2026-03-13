import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import confetti from "canvas-confetti";

export default function RewardScreen() {
  const { t } = useLanguage();
  const { score, setPage, setScore } = useApp();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const end = Date.now() + 3000;
    const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A29BFE", "#FD79A8"];
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleRestart = () => {
    setScore(0);
    setPage("landing");
  };

  const getMessage = () => {
    if (score >= 4) return t("reward.excellent");
    if (score >= 2) return t("reward.good");
    return t("reward.keep");
  };

  const stars = score;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#020817] px-6 py-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-600 opacity-15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-700 opacity-15 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
          className="text-8xl"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold text-white"
        >
          {t("reward.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-blue-200 leading-relaxed"
        >
          {t("reward.message")}
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl px-12 py-6 shadow-2xl shadow-yellow-400/30"
        >
          <p className="text-gray-900 text-lg font-bold mb-1">{t("reward.score")}</p>
          <p className="text-gray-900 text-6xl font-extrabold">{score} / 5</p>
        </motion.div>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-2"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
              className={`text-5xl ${i <= stars ? "opacity-100" : "opacity-20"}`}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-xl font-semibold text-cyan-300"
        >
          {getMessage()}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: "spring" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleRestart}
          className="mt-4 px-12 py-5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-2xl font-extrabold rounded-full shadow-2xl shadow-cyan-500/30 transition-all"
        >
          🚀 {t("reward.restart")}
        </motion.button>
      </div>
    </div>
  );
}
