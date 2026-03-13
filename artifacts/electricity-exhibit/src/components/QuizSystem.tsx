import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import { getQuestions } from "@/data/quizData";

const optionLetters = ["A", "B", "C", "D"];
const optionColors = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
];

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
    if (idx === q.correctIndex) setCorrectCount((c) => c + 1);
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
      return "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-violet-300 hover:shadow-md cursor-pointer";
    }
    if (idx === q.correctIndex) {
      return "bg-gradient-to-r from-emerald-500 to-green-400 text-white border-emerald-400 shadow-emerald-200 cursor-default";
    }
    if (idx === selected && idx !== q.correctIndex) {
      return "bg-gradient-to-r from-red-500 to-rose-400 text-white border-red-400 shadow-red-200 cursor-default";
    }
    return "bg-gray-50 text-gray-300 border-gray-100 cursor-default";
  };

  const progressPct = ((current + 1) / questions.length) * 100;

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-10"
      style={{ background: "linear-gradient(135deg, #fef9ff 0%, #f0f9ff 50%, #fefce8 100%)" }}
    >
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-200 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-200 opacity-30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setPage("game")}
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-600 rounded-xl font-semibold border border-gray-200 shadow-sm transition-all hover:shadow-md"
          >
            ← {t("quiz.back")}
          </button>
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-1 border border-violet-200 mb-1">
              <span className="text-violet-600 font-bold text-xs uppercase tracking-wider">Step 5</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800">{t("quiz.title")} ⚡</h1>
          </div>
          <div className="px-5 py-2.5 bg-white text-violet-700 rounded-xl font-bold text-lg border border-violet-200 shadow-sm">
            {current + 1} / {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full mb-6 overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7c3aed, #0ea5e9)" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
          >
            {/* Question card */}
            <div className="bg-white rounded-3xl p-8 mb-5 shadow-xl shadow-purple-100 border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-md">
                  {t("quiz.progress").charAt(0)}{current + 1}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                  {q.question}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3 mb-5">
              {q.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={!answered ? { scale: 1.02, x: 4 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-xl font-semibold border-2 transition-all shadow-sm ${getOptionClass(idx)}`}
                >
                  <span className={`inline-flex w-9 h-9 rounded-full items-center justify-center text-sm font-bold mr-4 shrink-0 ${
                    !answered ? `bg-gradient-to-br ${optionColors[idx]} text-white` : "bg-white/30 text-current"
                  }`}>
                    {optionLetters[idx]}
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
                  className={`rounded-2xl p-5 mb-5 border-2 ${
                    selected === q.correctIndex
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <p className={`text-xl font-bold mb-2 ${selected === q.correctIndex ? "text-emerald-700" : "text-red-700"}`}>
                    {selected === q.correctIndex ? t("quiz.correct") : t("quiz.wrong")}
                  </p>
                  {selected !== q.correctIndex && (
                    <p className="text-gray-600 text-lg leading-relaxed">{q.explanation}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {answered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="w-full py-5 text-white text-xl font-extrabold rounded-2xl shadow-xl shadow-violet-200 transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
              >
                {current < questions.length - 1 ? `${t("quiz.next")} →` : "🎉 See My Results!"}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
