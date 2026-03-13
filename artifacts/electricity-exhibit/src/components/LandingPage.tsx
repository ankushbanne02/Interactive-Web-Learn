import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));
    let raf: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const a = 0.4 + 0.6 * Math.abs(Math.sin(s.phase + t * s.speed));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function LandingPage() {
  const { t, setLanguage, language } = useLanguage();
  const { setPage } = useApp();
  const [selected, setSelected] = useState<"en" | "mr">(language as "en" | "mr");

  const handleExplore = () => {
    setLanguage(selected);
    setPage("scene");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020817]">
      <StarField />

      {/* Nebula blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-purple-700 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 opacity-15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500 opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-3xl">
        {/* Lightning icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-8xl"
        >
          ⚡
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
        >
          {t("landing.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-xl md:text-2xl text-blue-200 font-medium"
        >
          {t("landing.subtitle")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-yellow-300 font-semibold"
        >
          {t("landing.tagline")}
        </motion.p>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex gap-4"
        >
          <button
            onClick={() => setSelected("en")}
            className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-200 border-2 ${
              selected === "en"
                ? "bg-cyan-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/40 scale-105"
                : "bg-white/10 text-white border-white/30 hover:bg-white/20"
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setSelected("mr")}
            className={`px-8 py-4 rounded-2xl text-xl font-bold transition-all duration-200 border-2 ${
              selected === "mr"
                ? "bg-orange-500 text-white border-orange-300 shadow-lg shadow-orange-500/40 scale-105"
                : "bg-white/10 text-white border-white/30 hover:bg-white/20"
            }`}
          >
            🇮🇳 मराठी
          </button>
        </motion.div>

        {/* Explore Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleExplore}
          className="mt-4 px-14 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-2xl font-extrabold rounded-full shadow-2xl shadow-yellow-400/30 hover:shadow-yellow-400/60 transition-all"
        >
          {t("landing.explore")} 🚀
        </motion.button>
      </div>
    </div>
  );
}
