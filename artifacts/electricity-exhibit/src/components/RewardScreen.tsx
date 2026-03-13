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
    const end = Date.now() + 4000;
    const colors = ["#7c3aed", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899"];
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors });
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

  const getScoreColor = () => {
    if (score >= 4) return "from-emerald-500 to-green-400";
    if (score >= 2) return "from-blue-500 to-cyan-400";
    return "from-orange-500 to-amber-400";
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-12"
      style={{ background: "linear-gradient(135deg, #fefce8 0%, #f0fdf4 30%, #faf5ff 70%, #fef3c7 100%)" }}
    >
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-yellow-200 opacity-50 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-200 opacity-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-200 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-2xl w-full">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
          className="text-9xl"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-800"
        >
          {t("reward.title")}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl px-8 py-6 shadow-xl border border-purple-100 max-w-lg"
        >
          <p className="text-xl text-gray-600 leading-relaxed">
            {t("reward.message")}
          </p>
        </motion.div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, type: "spring" }}
          className={`bg-gradient-to-br ${getScoreColor()} rounded-3xl px-16 py-8 shadow-2xl text-white`}
        >
          <p className="text-white/80 text-lg font-bold mb-1 uppercase tracking-wider">
            {t("reward.score")}
          </p>
          <p className="text-7xl font-extrabold">{score} / 5</p>
        </motion.div>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
              className={`text-5xl transition-all ${i <= score ? "opacity-100 drop-shadow-lg" : "opacity-20 grayscale"}`}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        {/* Message badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-100"
        >
          <p className="text-xl font-bold text-gray-700">{getMessage()}</p>
        </motion.div>

        {/* Restart button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: "spring" }}
          whileHover={{ scale: 1.07, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRestart}
          className="px-14 py-5 text-white text-2xl font-extrabold rounded-full shadow-2xl shadow-violet-200 transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
        >
          🚀 {t("reward.restart")}
        </motion.button>
      </div>
    </div>
  );
}
