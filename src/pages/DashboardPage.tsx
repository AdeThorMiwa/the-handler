import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Bell, Settings, Construction } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAuth } from "@/contexts/auth/useAuth";

// ── Coming-Soon placeholder ───────────────────────────────────────────────────

interface ComingSoonProps {
  title: string;
  description?: string;
  icon: React.ElementType;
}

function ComingSoon({ title, description, icon: Icon }: ComingSoonProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm px-6">
        {/* Icon bubble */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center shadow-sm">
            <Icon className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-100 border-2 border-background flex items-center justify-center">
            <Construction className="h-3 w-3 text-amber-600" />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description ??
              "This section is under construction. Check back soon — it'll be worth the wait."}
          </p>
        </div>

        {/* Status pill */}
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          In development
        </span>
      </div>
    </div>
  );
}

// ── Named placeholder pages exported for route use ────────────────────────────

export function AnalyticsPage() {
  return (
    <ComingSoon
      title="Analytics"
      description="Track your job search performance — application rates, response times, match score trends, and pipeline velocity."
      icon={BarChart3}
    />
  );
}

export function NotificationsPage() {
  return (
    <ComingSoon
      title="Notifications"
      description="Stay on top of recruiter emails, interview invites, and application status changes — all in one place."
      icon={Bell}
    />
  );
}

export function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Fine-tune your automation rules, update your knowledge base, and manage connected integrations."
      icon={Settings}
    />
  );
}

// ── Page transition variants ──────────────────────────────────────────────────

const contentVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const contentTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

// ── DashboardPage ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isAuthenticated, isOnboarded } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <Sidebar />

      {/* ── Main content area ─────────────────────────────────────────── */}
      <main className="relative flex-1 overflow-hidden min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={contentTransition}
            className="h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
