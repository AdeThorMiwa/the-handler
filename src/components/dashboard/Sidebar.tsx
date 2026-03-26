import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Settings,
  Bell,
  BarChart3,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth/useAuth";

// ── Nav items ─────────────────────────────────────────────────────────────────

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    to: "/dashboard/applications",
    label: "Applications",
    icon: FileText,
    badge: 9,
  },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  {
    to: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    badge: 2,
  },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

const stats = [
  { label: "Applied", value: "2", color: "text-blue-600", bg: "bg-blue-50" },
  {
    label: "Interview",
    value: "2",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Offers",
    value: "1",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-55 shrink-0 h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden">
      {/* ── Brand ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 py-4 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/25">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-sm font-semibold text-foreground tracking-tight leading-none block">
            Career OS
          </span>
          <span className="text-[10px] font-mono text-muted-foreground leading-none mt-0.5 block">
            v0.1.0
          </span>
        </div>
      </div>

      <Separator />

      {/* ── Automation status ──────────────────────────────────────────── */}
      <div className="px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-emerald-700 leading-none">
              Automation active
            </p>
            <p className="text-[10px] font-mono text-emerald-600/80 mt-0.5 truncate">
              Next scan: 09:00 AM
            </p>
          </div>
          <Zap className="h-3 w-3 text-emerald-500 shrink-0" />
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm",
                  "transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  isActive
                    ? "font-medium text-primary"
                    : "text-sidebar-muted hover:bg-slate-50 hover:text-foreground",
                )
              }
              style={({ isActive }) =>
                isActive
                  ? { backgroundColor: "rgb(124 58 237 / 0.08)" }
                  : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />

                  <span className="flex-1 truncate">{item.label}</span>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "text-[10px] font-mono font-semibold px-1.5 py-0.5",
                        "rounded-full min-w-4.5 text-center leading-none",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight className="h-3 w-3 text-primary/60 shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Quick Stats ───────────────────────────────────────────────── */}
      <div className="px-4 py-3 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          This week
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-lg border border-transparent",
                stat.bg,
              )}
            >
              <span
                className={cn(
                  "text-base font-bold font-mono leading-none",
                  stat.color,
                )}
              >
                {stat.value}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* ── User profile + logout ──────────────────────────────────────── */}
      <div className="px-4 py-3.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="text-[11px] bg-primary/10 text-primary">
              AT
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate leading-none">
              Ade Thormiwa
            </p>
            <p className="text-[10px] font-mono text-muted-foreground truncate mt-0.5">
              ade@thormiwa.com
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Badge
              variant="success"
              className="text-[9px] py-0 px-1.5 h-4 font-mono"
            >
              Pro
            </Badge>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center",
                "text-muted-foreground hover:text-destructive hover:bg-rose-50",
                "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              )}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="sr-only">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
