import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

const floatingIcons = ["⚡", "💡", "🔋", "🌊", "⚙️", "🏭", "🔌", "🌞"];

export default function LandingPage() {
  const { t, setLanguage, language } = useLanguage();
  const { setPage } = useApp();
  const [selected, setSelected] = useState<"en" | "mr">(language as "en" | "mr");

  const handleExplore = () => {
    setLanguage(selected);
    setPage("scene");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #fef3c7 30%, #fce7f3 60%, #ede9fe 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-300 opacity-20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-purple-300 opacity-20 rounded-full blur-3xl" />

      {/* Floating background icons */}
      {floatingIcons.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl select-none pointer-events-none opacity-20"
          style={{
            left: `${8 + (i * 12) % 85}%`,
            top: `${10 + (i * 17) % 80}%`,
          }}
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          {icon}
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-purple-200/50 px-10 py-12 mx-6 max-w-2xl w-full border border-white/60 text-center"
      >
        {/* Animated lightning bolt */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl mb-4 inline-block"
        >
          ⚡
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight"
          style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {t("landing.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-lg md:text-xl text-gray-600 font-medium mb-3"
        >
          {t("landing.subtitle")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-base font-semibold text-orange-500 mb-8"
        >
          🚀 {t("landing.tagline")}
        </motion.p>

        {/* Language selector label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3"
        >
          {t("landing.selectLang")}
        </motion.p>

        {/* Language buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected("en")}
            className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-200 border-2 ${
              selected === "en"
                ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-blue-400 shadow-lg shadow-blue-300/40"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            🇬🇧 English
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected("mr")}
            className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-200 border-2 ${
              selected === "mr"
                ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white border-orange-400 shadow-lg shadow-orange-300/40"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
            }`}
          >
            🇮🇳 मराठी
          </motion.button>
        </motion.div>

        {/* Explore button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.07, y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleExplore}
          className="w-full py-5 text-2xl font-extrabold text-white rounded-2xl shadow-xl shadow-purple-300/50 transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
        >
          {t("landing.explore")} 🚀
        </motion.button>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 mt-6"
        >
          {["🔬", "🎬", "🎮", "🧠", "🏆"].map((icon, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-lg shadow-sm border border-purple-200">
                {icon}
              </div>
            </div>
          ))}
        </motion.div>
        <p className="text-xs text-gray-400 mt-2">3D Model → Video → Game → Quiz → Reward</p>
      </motion.div>
    </div>
  );
}
