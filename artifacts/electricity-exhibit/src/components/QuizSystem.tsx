import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import { getQuestions } from "@/data/quizData";

const LETTERS = ["A", "B", "C", "D"];

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
  const progressPct = ((current + (answered ? 1 : 0)) / questions.length) * 100;

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
      setScore(correctCount);
      setPage("reward");
    }
  };

  const getOptionStyle = (idx: number): React.CSSProperties => {
    if (!answered) {
      return {
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        color: "#334155",
        cursor: "pointer",
      };
    }
    if (idx === q.correctIndex) {
      return {
        background: "rgba(16,185,129,0.08)",
        border: "1.5px solid rgba(16,185,129,0.5)",
        color: "#047857",
        cursor: "default",
      };
    }
    if (idx === selected) {
      return {
        background: "rgba(239,68,68,0.08)",
        border: "1.5px solid rgba(239,68,68,0.4)",
        color: "#b91c1c",
        cursor: "default",
      };
    }
    return {
      background: "#f8fafc",
      border: "1.5px solid #e2e8f0",
      color: "#94a3b8",
      cursor: "default",
    };
  };

  const isCorrect = selected === q.correctIndex;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#f8fafc" }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(124,58,237,0.1)", color: "#7c3aed",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase"
          }}>
            Step 5 / 5
          </span>
          <h1 style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            🧠 {t("quiz.title")}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#64748b", fontSize: "0.88rem", fontWeight: 600 }}>
            {t("quiz.progress")}{current + 1} / {questions.length}
          </span>
          <button
            onClick={() => setPage("game")}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 600, background: "#f1f5f9", color: "#475569",
              border: "1px solid #e2e8f0", cursor: "pointer"
            }}
          >
            ← {t("quiz.back")}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="shrink-0" style={{ height: "4px", background: "#e2e8f0" }}>
        <motion.div
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ height: "100%", background: "linear-gradient(90deg, #7c3aed, #2563eb)" }}
        />
      </div>

      {/* Quiz content */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-8 py-6">
        <div style={{ width: "100%", maxWidth: "720px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.28 }}
            >
              {/* Question */}
              <div style={{
                background: "#ffffff", border: "1px solid #e2e8f0",
                borderRadius: "12px", padding: "24px 28px", marginBottom: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0,
                    background: "rgba(124,58,237,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#7c3aed", fontWeight: 800, fontSize: "0.9rem",
                  }}>
                    {t("quiz.progress")}{current + 1}
                  </div>
                  <p style={{ color: "#1e293b", fontSize: "1.2rem", fontWeight: 600, lineHeight: 1.55, margin: 0 }}>
                    {q.question}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                {q.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={!answered ? { x: 4 } : {}}
                    onClick={() => handleSelect(idx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "13px 18px",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.15s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                      ...getOptionStyle(idx),
                    }}
                  >
                    <span style={{
                      width: "28px", height: "28px", borderRadius: "6px",
                      background: "rgba(124,58,237,0.1)", color: "#7c3aed",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
                    }}>
                      {LETTERS[idx]}
                    </span>
                    {opt}
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      borderRadius: "10px",
                      padding: "12px 16px",
                      marginBottom: "12px",
                      background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                  >
                    <p style={{ color: isCorrect ? "#047857" : "#b91c1c", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 4px" }}>
                      {isCorrect ? t("quiz.correct") : t("quiz.wrong")}
                    </p>
                    {!isCorrect && (
                      <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
                        {q.explanation}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {answered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  style={{
                    width: "100%", padding: "0.85rem",
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    color: "#ffffff", fontWeight: 700, fontSize: "1rem",
                    borderRadius: "10px", border: "none", cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                  }}
                >
                  {current < questions.length - 1 ? `${t("quiz.next")} →` : "🎉 See Results"}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
