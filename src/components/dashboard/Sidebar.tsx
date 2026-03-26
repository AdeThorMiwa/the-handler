import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Settings,
  Bell,
  BarChart3,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: FileText, badge: 9 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 2 },
  { id: "settings", label: "Settings", icon: Settings },
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

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-55 shrink-0 h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden">
      {/* Brand */}
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

      {/* Automation status pill */}
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/8 text-primary font-medium"
                  : "text-sidebar-muted hover:bg-slate-50 hover:text-foreground",
              )}
              style={
                isActive
                  ? { backgroundColor: "rgb(124 58 237 / 0.08)" }
                  : undefined
              }
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="flex-1 text-left truncate">{item.label}</span>

              {item.badge !== undefined && (
                <span
                  className={cn(
                    "text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full min-w-4.5 text-center leading-none",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight className="h-3 w-3 text-primary shrink-0 opacity-60" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Quick Stats */}
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

      {/* User profile */}
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
          <Badge
            variant="success"
            className="text-[9px] py-0 px-1.5 h-4 font-mono shrink-0"
          >
            Pro
          </Badge>
        </div>
      </div>
    </aside>
  );
}
