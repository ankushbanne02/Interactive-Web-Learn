import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import { getQuestions } from "@/data/quizData";

export default function QuizSystem() {
  const { t, language } = useLanguage();
  const { setPage, ageGroup, setScore } = useApp();

  const questions = useMemo(
    () => getQuestions(ageGroup ?? "5-10", language as "en" | "mr"),
    [ageGroup, language]
  );

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const finalScore = selected === q.correctIndex ? correctCount + 1 : correctCount;
      setScore(finalScore);
      setPage("reward");
    }
  };

  const getOptionClass = (idx: number) => {
    if (!answered) {
      return "bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-cyan-400 cursor-pointer";
    }
    if (idx === q.correctIndex) {
      return "bg-emerald-500/80 text-white border-emerald-400 cursor-default";
    }
    if (idx === selected && idx !== q.correctIndex) {
      return "bg-red-500/80 text-white border-red-400 cursor-default";
    }
    return "bg-white/5 text-white/40 border-white/10 cursor-default";
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#020817] px-6 py-12">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-700 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-600 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setPage("game")}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-all"
          >
            ← {t("quiz.back")}
          </button>
          <h1 className="text-2xl font-extrabold text-white">{t("quiz.title")} ⚡</h1>
          <div className="px-4 py-2 bg-white/10 text-cyan-300 rounded-lg font-bold text-lg border border-white/10">
            {t("quiz.progress")} {current + 1} {t("quiz.of")} {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/10 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question */}
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-6 border border-white/10">
              <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {q.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={!answered ? { scale: 1.02 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-6 py-5 rounded-2xl text-xl font-semibold border-2 transition-all ${getOptionClass(idx)}`}
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-white/20 text-white text-center font-bold mr-4 text-base leading-8">
                    {["A", "B", "C", "D"][idx]}
                  </span>
                  {opt}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`rounded-2xl p-5 mb-6 border ${
                    selected === q.correctIndex
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-red-500/20 border-red-400"
                  }`}
                >
                  <p className={`text-xl font-bold mb-2 ${selected === q.correctIndex ? "text-emerald-300" : "text-red-300"}`}>
                    {selected === q.correctIndex ? t("quiz.correct") : t("quiz.wrong")}
                  </p>
                  {selected !== q.correctIndex && (
                    <p className="text-white/80 text-lg">{q.explanation}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {answered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleNext}
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xl font-extrabold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all"
              >
                {current < questions.length - 1
                  ? `${t("quiz.next")} →`
                  : "🎉 See Results!"}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
