import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Providers from "./Providers";
import LoginCard from "@/components/auth/LoginCard";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import Sidebar from "@/components/dashboard/Sidebar";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { AppView } from "@/types";

// ── View transition variants ───────────────────────────────────────────────────

const pageVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ── Inner app (needs access to Providers context) ─────────────────────────────

function CareerOS() {
  const [view, setView] = useState<AppView>("auth");
  const [sidebarView, setSidebarView] = useState("dashboard");

  const handleAuthSuccess = useCallback(() => {
    setView("onboarding");
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setView("dashboard");
  }, []);

  return (
    <TooltipProvider delayDuration={400}>
      <AnimatePresence mode="wait">
        {/* ── Auth ────────────────────────────────────────────────────── */}
        {view === "auth" && (
          <motion.div
            key="auth"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen"
          >
            <LoginCard onSuccess={handleAuthSuccess} />
          </motion.div>
        )}

        {/* ── Onboarding ───────────────────────────────────────────────── */}
        {view === "onboarding" && (
          <motion.div
            key="onboarding"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen"
          >
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {/* ── Dashboard ────────────────────────────────────────────────── */}
        {view === "dashboard" && (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="flex h-screen overflow-hidden bg-background"
          >
            {/* Sidebar */}
            <Sidebar activeView={sidebarView} onViewChange={setSidebarView} />

            {/* Main content */}
            <main className="flex-1 overflow-hidden min-w-0">
              <KanbanBoard className="h-full" />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Providers>
      <CareerOS />
    </Providers>
  );
}
