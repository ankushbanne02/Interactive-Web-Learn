import { AnimatePresence, motion } from "framer-motion";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppProvider, useApp } from "@/context/AppContext";
import LandingPage from "@/components/LandingPage";
import ThreeDScene from "@/components/ThreeDScene";
import AgeSelection from "@/components/AgeSelection";
import VideoPlayer from "@/components/VideoPlayer";
import GameEmbed from "@/components/GameEmbed";
import QuizSystem from "@/components/QuizSystem";
import RewardScreen from "@/components/RewardScreen";
import HelpButton from "@/components/HelpButton";

function AppContent() {
  const { page } = useApp();

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {page === "landing" && <LandingPage />}
          {page === "scene" && <ThreeDScene />}
          {page === "age" && <AgeSelection />}
          {page === "video" && <VideoPlayer />}
          {page === "game" && <GameEmbed />}
          {page === "quiz" && <QuizSystem />}
          {page === "reward" && <RewardScreen />}
        </motion.div>
      </AnimatePresence>
      {page !== "landing" && <HelpButton />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
