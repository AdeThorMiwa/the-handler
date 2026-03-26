import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Unlink,
  X,
  Zap,
} from "lucide-react";

// Inline LinkedIn logo since lucide-react doesn't export it
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface JobDirectoriesProps {
  connectedDirectories: string[];
  onConnectionChange: (directories: string[]) => void;
}

// ── LinkedIn OAuth Popup Simulation ──────────────────────────────────────────

interface OAuthPopupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function LinkedInOAuthPopup({ onSuccess, onCancel }: OAuthPopupProps) {
  const [step, setStep] = useState<"consent" | "connecting" | "success">(
    "consent",
  );

  const handleAuthorise = useCallback(() => {
    setStep("connecting");
    // Simulate OAuth flow delay
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 900);
    }, 1600);
  }, [onSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget && step === "consent") onCancel();
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 8 }}
        transition={{ type: "spring", damping: 28, stiffness: 340, mass: 0.7 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Popup header — mimics LinkedIn branding */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center">
              <LinkedinIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-none">
                LinkedIn
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sign in to authorise
              </p>
            </div>
          </div>

          {step === "consent" && (
            <button
              type="button"
              onClick={onCancel}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>

        {/* Popup body */}
        <div className="px-5 py-5">
          <AnimatePresence mode="wait">
            {step === "consent" && (
              <motion.div
                key="consent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-sm font-medium text-slate-800 mb-1">
                  Career OS is requesting access to:
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  career-os.app · Verified application
                </p>

                <div className="space-y-2.5 mb-5">
                  {[
                    {
                      icon: Search,
                      label: "Search job listings on your behalf",
                      color: "text-blue-500",
                      bg: "bg-blue-50",
                    },
                    {
                      icon: ExternalLink,
                      label: "Submit Easy Apply applications",
                      color: "text-violet-500",
                      bg: "bg-violet-50",
                    },
                    {
                      icon: ShieldCheck,
                      label: "Read-only profile access",
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${item.bg}`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                        </div>
                        <p className="text-sm text-slate-700">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 mb-5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <p className="text-[11px] text-slate-500 leading-snug">
                    You can revoke access at any time from your LinkedIn
                    security settings.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-200"
                    onClick={onCancel}
                  >
                    Deny
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white gap-1.5"
                    onClick={handleAuthorise}
                  >
                    Authorise
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "connecting" && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="mb-4"
                >
                  <RefreshCw className="h-8 w-8 text-[#0A66C2]" />
                </motion.div>
                <p className="text-sm font-medium text-slate-800">
                  Connecting to LinkedIn…
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Establishing a secure connection
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                }}
                className="flex flex-col items-center py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 300,
                    delay: 0.1,
                  }}
                  className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                </motion.div>
                <p className="text-sm font-semibold text-slate-800">
                  LinkedIn connected!
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Career OS can now search and apply on your behalf.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Directory Card ────────────────────────────────────────────────────────────

interface DirectoryCardProps {
  id: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  accentColor: string;
  isConnected: boolean;
  isComingSoon?: boolean;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

function DirectoryCard({
  id,
  name,
  description,
  logo,
  accentColor,
  isConnected,
  isComingSoon = false,
  onConnect,
  onDisconnect,
}: DirectoryCardProps) {
  return (
    <motion.div
      layout
      className={[
        "rounded-xl border bg-card overflow-hidden transition-shadow duration-200",
        isConnected
          ? "border-l-4 border-l-emerald-400 border-t-slate-100 border-r-slate-100 border-b-slate-100 shadow-sm"
          : "border-slate-100",
        isComingSoon ? "opacity-60" : "",
      ].join(" ")}
    >
      <div className={isConnected ? "pl-3 pr-5 py-5" : "px-5 py-5"}>
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div
            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${accentColor}`}
          >
            {logo}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">
                {name}
              </span>

              {isConnected && (
                <Badge
                  variant="success"
                  className="text-[11px] py-0 px-2 h-5 font-mono"
                >
                  Connected
                </Badge>
              )}

              {isComingSoon && (
                <Badge
                  variant="coming-soon"
                  className="text-[11px] py-0 px-2 h-5 font-mono"
                >
                  Coming Soon
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>

            {isConnected && (
              <p className="text-[11px] font-mono text-emerald-600 mt-1.5">
                ● Active · Scanning daily
              </p>
            )}
          </div>

          {/* Action */}
          <div className="shrink-0">
            {!isComingSoon && !isConnected && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs border-slate-200 hover:border-primary/40 hover:text-primary"
                onClick={() => onConnect(id)}
              >
                <Zap className="h-3.5 w-3.5" />
                Connect
              </Button>
            )}

            {!isComingSoon && isConnected && (
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => onDisconnect(id)}
              >
                <Unlink className="h-3.5 w-3.5" />
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const directories = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description:
      "Search and apply to thousands of roles via LinkedIn Easy Apply. Supports job alerts, profile matching, and direct applications.",
    accentColor: "bg-[#0A66C2]/10",
    isComingSoon: false,
    logo: <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" />,
  },
  {
    id: "indeed",
    name: "Indeed",
    description:
      "The world's largest job board. Automated applications, salary insights, and company reviews — coming soon.",
    accentColor: "bg-[#2164F3]/10",
    isComingSoon: true,
    logo: (
      <span className="text-base font-black text-[#2164F3] tracking-tighter leading-none">
        in
      </span>
    ),
  },
  {
    id: "wellfound",
    name: "Wellfound",
    description:
      "The go-to platform for startup roles. Equity-first listings, direct founder outreach, and startup-specific job matching — coming soon.",
    accentColor: "bg-slate-100",
    isComingSoon: true,
    logo: (
      <span className="text-xs font-black text-slate-600 tracking-tight leading-none uppercase">
        WF
      </span>
    ),
  },
];

export default function JobDirectories({
  connectedDirectories,
  onConnectionChange,
}: JobDirectoriesProps) {
  const [showOAuthPopup, setShowOAuthPopup] = useState(false);
  const [pendingDirectoryId, setPendingDirectoryId] = useState<string | null>(
    null,
  );

  const handleConnect = useCallback((id: string) => {
    if (id === "linkedin") {
      setPendingDirectoryId(id);
      setShowOAuthPopup(true);
    }
  }, []);

  const handleOAuthSuccess = useCallback(() => {
    if (pendingDirectoryId) {
      onConnectionChange([...connectedDirectories, pendingDirectoryId]);
    }
    setShowOAuthPopup(false);
    setPendingDirectoryId(null);
  }, [pendingDirectoryId, connectedDirectories, onConnectionChange]);

  const handleOAuthCancel = useCallback(() => {
    setShowOAuthPopup(false);
    setPendingDirectoryId(null);
  }, []);

  const handleDisconnect = useCallback(
    (id: string) => {
      onConnectionChange(connectedDirectories.filter((d) => d !== id));
    },
    [connectedDirectories, onConnectionChange],
  );

  const connectedCount = connectedDirectories.length;

  return (
    <div className="space-y-5">
      {/* Header context */}
      <div className="p-4 rounded-xl bg-accent/60 border border-accent-foreground/10 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Search className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Where should we search for you?
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Connect at least one platform. Career OS will scan for matching
            roles based on your preferences and apply automatically.
          </p>
        </div>
      </div>

      {/* Directory cards */}
      <div className="space-y-3">
        {directories.map((dir) => (
          <DirectoryCard
            key={dir.id}
            id={dir.id}
            name={dir.name}
            description={dir.description}
            logo={dir.logo}
            accentColor={dir.accentColor}
            isConnected={connectedDirectories.includes(dir.id)}
            isComingSoon={dir.isComingSoon}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>

      {/* Status footer */}
      <AnimatePresence>
        {connectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            <Separator className="mb-4" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground font-mono">
                  {connectedCount}
                </span>{" "}
                {connectedCount === 1 ? "directory" : "directories"} connected
                and ready to scan.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OAuth Popup */}
      <AnimatePresence>
        {showOAuthPopup && (
          <LinkedInOAuthPopup
            onSuccess={handleOAuthSuccess}
            onCancel={handleOAuthCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
