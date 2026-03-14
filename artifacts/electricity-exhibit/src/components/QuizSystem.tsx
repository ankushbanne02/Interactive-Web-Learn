import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";
import { getQuestions } from "@/data/quizData";

const LETTERS = ["A", "B", "C", "D"];
const LETTER_COLORS = ["#7c3aed", "#2563eb", "#0891b2", "#059669"];

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
    if (idx === q.correctIndex) setCorrectCount(c => c + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setScore(correctCount);
      setPage("reward");
    }
  };

  const getOptionStyle = (idx: number): React.CSSProperties => {
    const baseColor = LETTER_COLORS[idx % LETTER_COLORS.length];
    if (!answered) {
      return {
        background: "#ffffff",
        border: `2px solid ${baseColor}25`,
        color: "#334155",
        cursor: "pointer",
      };
    }
    if (idx === q.correctIndex) {
      return {
        background: "linear-gradient(135deg, rgba(5,150,105,0.1), rgba(6,148,130,0.1))",
        border: "2px solid rgba(5,150,105,0.5)",
        color: "#065f46",
        cursor: "default",
      };
    }
    if (idx === selected) {
      return {
        background: "rgba(239,68,68,0.08)",
        border: "2px solid rgba(239,68,68,0.4)",
        color: "#991b1b",
        cursor: "default",
      };
    }
    return {
      background: "#f8fafc",
      border: "2px solid #e2e8f0",
      color: "#94a3b8",
      cursor: "default",
    };
  };

  const isCorrect = selected === q.correctIndex;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f0f9ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}
    >
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid #e2e8f0", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(124,58,237,0.1)", color: "#7c3aed",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase",
          }}>
            {t("scene.stepLabel")} 5 / 5
          </span>
          <h1 style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            🧠 {t("quiz.title")}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Mini step dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: i === current ? "20px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i < current
                  ? "#7c3aed"
                  : i === current
                  ? "linear-gradient(135deg, #7c3aed, #2563eb)"
                  : "#e2e8f0",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <span style={{ color: "#64748b", fontSize: "0.88rem", fontWeight: 600 }}>
            {t("quiz.progress")}{current + 1} / {questions.length}
          </span>
          <button
            onClick={() => setPage("game")}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 600, background: "#f1f5f9", color: "#475569",
              border: "1px solid #e2e8f0", cursor: "pointer",
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
          style={{ height: "100%", background: "linear-gradient(90deg, #7c3aed, #2563eb, #0891b2)" }}
        />
      </div>

      {/* Quiz content */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-8 py-4">
        <div style={{ width: "100%", maxWidth: "740px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Question card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "22px 26px",
                  marginBottom: "14px",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
                  borderLeft: "4px solid #7c3aed",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#ffffff", fontWeight: 800, fontSize: "0.85rem",
                    boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                  }}>
                    {t("quiz.progress")}{current + 1}
                  </div>
                  <p style={{ color: "#1e293b", fontSize: "1.18rem", fontWeight: 700, lineHeight: 1.55, margin: 0 }}>
                    {q.question}
                  </p>
                </div>
              </motion.div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "14px" }}>
                {q.options.map((opt, idx) => {
                  const letterColor = LETTER_COLORS[idx % LETTER_COLORS.length];
                  const isThisCorrect = answered && idx === q.correctIndex;
                  const isThisWrong = answered && idx === selected && idx !== q.correctIndex;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={!answered ? { x: 6, boxShadow: `0 4px 20px ${letterColor}20` } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(idx)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        fontSize: "0.97rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        transition: "all 0.18s ease",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        ...getOptionStyle(idx),
                      }}
                    >
                      <span style={{
                        width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                        background: isThisCorrect
                          ? "rgba(5,150,105,0.15)"
                          : isThisWrong
                          ? "rgba(239,68,68,0.15)"
                          : `${letterColor}15`,
                        color: isThisCorrect ? "#059669" : isThisWrong ? "#dc2626" : letterColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.82rem", fontWeight: 800,
                        border: `1.5px solid ${isThisCorrect ? "rgba(5,150,105,0.3)" : isThisWrong ? "rgba(239,68,68,0.3)" : `${letterColor}30`}`,
                      }}>
                        {isThisCorrect ? "✓" : isThisWrong ? "✗" : LETTERS[idx]}
                      </span>
                      <span style={{ flex: 1 }}>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      borderRadius: "12px",
                      padding: "14px 18px",
                      marginBottom: "12px",
                      background: isCorrect
                        ? "linear-gradient(135deg, rgba(5,150,105,0.1), rgba(6,148,130,0.08))"
                        : "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.06))",
                      border: `1.5px solid ${isCorrect ? "rgba(5,150,105,0.3)" : "rgba(239,68,68,0.3)"}`,
                      display: "flex", gap: "12px", alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>
                      {isCorrect ? "🎉" : "💡"}
                    </span>
                    <div>
                      <p style={{
                        color: isCorrect ? "#065f46" : "#991b1b",
                        fontWeight: 700, fontSize: "0.95rem", margin: "0 0 4px",
                      }}>
                        {isCorrect ? t("quiz.correct") : t("quiz.wrong")}
                      </p>
                      {!isCorrect && (
                        <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next button */}
              {answered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 16 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  style={{
                    width: "100%", padding: "0.9rem",
                    background: "linear-gradient(135deg, #7c3aed, #2563eb, #0891b2)",
                    color: "#ffffff", fontWeight: 800, fontSize: "1rem",
                    borderRadius: "12px", border: "none", cursor: "pointer",
                    boxShadow: "0 6px 24px rgba(124,58,237,0.35)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {current < questions.length - 1
                    ? `${t("quiz.next")} →`
                    : "🎉 See Results"}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
