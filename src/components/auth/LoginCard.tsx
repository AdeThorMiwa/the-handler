import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { HardDrive, Mail, ShieldCheck, Sparkles } from "lucide-react";
import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LoginCardProps {
  onSuccess: () => void;
}

const permissionItems = [
  {
    icon: HardDrive,
    title: "Google Drive access",
    description: "Sync and store tailored resumes in your Drive",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Mail,
    title: "Gmail read access",
    description: "Track application emails and recruiter replies",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: ShieldCheck,
    title: "Secure & private",
    description: "Data is never shared or sold. You stay in control.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export default function LoginCard({ onSuccess }: LoginCardProps) {
  const login = useGoogleLogin({
    flow: "auth-code",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/gmail.readonly",
    ].join(" "),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-105"
      >
        {/* Brand mark */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "backOut" }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4 shadow-lg shadow-primary/20"
          >
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Career OS
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your automated job search engine
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card rounded-xl border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* Card header */}
          <div className="px-6 pt-6 pb-5">
            <h2 className="text-base font-semibold text-foreground">
              Sign in to continue
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Use your Google account to get started.
            </p>
          </div>

          <div className="px-6 pb-6">
            {/* Google Button */}
            <Button
              size="lg"
              variant="outline"
              className="w-full h-11 font-medium border-slate-200 hover:border-slate-300 hover:bg-slate-50 gap-3"
              onClick={() => login()}
            >
              {/* Google "G" logo */}
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <Separator className="my-5" />

            {/* Permissions context */}
            <div className="space-y-1 mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Permissions requested
              </p>
              <div className="space-y-2.5">
                {permissionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div
                        className={`shrink-0 w-7 h-7 rounded-md flex items-center justify-center mt-0.5 ${item.bg}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground mt-5 leading-relaxed"
        >
          By continuing, you agree to Career OS'{" "}
          <button className="underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer">
            Privacy Policy
          </button>
          .
        </motion.p>
      </motion.div>
    </div>
  );
}
