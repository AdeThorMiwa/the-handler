import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Providers from "./Providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import DashboardPage, {
  AnalyticsPage,
  NotificationsPage,
  SettingsPage,
} from "@/pages/DashboardPage";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import { AuthProvider } from "./contexts/auth/provider";
import { UserProvider } from "./contexts/user/provider";

// ── Top-level page transition ─────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ── Index redirect ────────────────────────────────────────────────────────────
// Reads auth state from localStorage directly so it works outside the provider
// (the provider re-hydrates the same values; this is just for the first render)

function IndexRedirect() {
  const isAuthenticated = localStorage.getItem("career-os:auth") === "true";
  const isOnboarded = localStorage.getItem("career-os:onboarded") === "true";

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/dashboard" replace />;
}

// ── Animated route tree ───────────────────────────────────────────────────────
//
// We key the animation on the *top-level* segment only (login / onboarding /
// dashboard) so that navigating between dashboard sub-routes (/dashboard/
// applications → /dashboard/analytics) does NOT re-animate the whole page –
// DashboardPage handles its own inner transition via its own AnimatePresence.

function AppRoutes() {
  const location = useLocation();

  // "login" | "onboarding" | "dashboard" | ""
  const topSegment = location.pathname.split("/")[1] ?? "";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={topSegment}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        // Ensure full viewport coverage so exiting pages don't collapse
        className="min-h-screen"
      >
        {/*
          Pass `location` to <Routes> so AnimatePresence can intercept the
          unmount and let exit animations finish before switching.
        */}
        <Routes location={location}>
          {/* ── Root redirect ──────────────────────────────────────── */}
          <Route path="/" element={<IndexRedirect />} />

          {/* ── Auth ───────────────────────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Onboarding ─────────────────────────────────────────── */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* ── Dashboard (nested) ─────────────────────────────────── */}
          <Route path="/dashboard" element={<DashboardPage />}>
            {/* Default sub-route: redirect to /dashboard/applications */}
            <Route index element={<Navigate to="applications" replace />} />

            {/* Kanban board – the primary view */}
            <Route
              path="applications"
              element={<KanbanBoard className="h-full" />}
            />

            {/* Placeholder sections */}
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ── Catch-all ──────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      {/* GoogleOAuthProvider */}
      <Providers>
        {/* App-level auth state (persisted in localStorage) */}
        <AuthProvider>
          <UserProvider>
            {/* Radix Tooltip singleton */}
            <TooltipProvider delayDuration={400}>
              <AppRoutes />
            </TooltipProvider>
          </UserProvider>
        </AuthProvider>
      </Providers>
    </BrowserRouter>
  );
}
