import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  TrendingUp,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  RefreshCw,
} from "lucide-react";
import KanbanColumn from "@/components/dashboard/KanbanColumn";
import JobDetailSheet from "@/components/dashboard/JobDetailSheet";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { mockJobs, kanbanColumnMeta } from "@/data/mock";
import type { Job, KanbanStatus } from "@/types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  className?: string;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, sub, color, bg, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-center gap-3.5 min-w-40">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          bg,
        )}
      >
        <span className={color}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold font-mono text-foreground leading-none">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
          {label}
        </p>
        {sub && (
          <p className="text-[11px] font-mono text-muted-foreground/60 mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── KanbanBoard ───────────────────────────────────────────────────────────────

export default function KanbanBoard({ className }: KanbanBoardProps) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Derived data ──────────────────────────────────────────────────────────

  const filteredJobs = searchQuery.trim()
    ? jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.tags?.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : jobs;

  const jobsByStatus = kanbanColumnMeta.reduce<Record<KanbanStatus, Job[]>>(
    (acc, col) => {
      acc[col.id] = filteredJobs.filter((j) => j.status === col.id);
      return acc;
    },
    {
      saved: [],
      applied: [],
      interview: [],
      declined: [],
      offer: [],
    },
  );

  // Stats
  const totalJobs = jobs.length;
  const appliedCount = jobs.filter((j) =>
    ["applied", "interview", "offer"].includes(j.status),
  ).length;
  const interviewCount = jobs.filter((j) => j.status === "interview").length;
  const offerCount = jobs.filter((j) => j.status === "offer").length;
  const avgMatchScore =
    jobs.length > 0
      ? Math.round(jobs.reduce((sum, j) => sum + j.matchScore, 0) / jobs.length)
      : 0;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleJobClick = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsSheetOpen(true);
  }, []);

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Slight delay before clearing so exit animation completes
      setTimeout(() => setSelectedJob(null), 300);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate a scan
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1800);
  }, []);

  const handleJobUpdate = useCallback((updatedJob: Job) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)),
    );
  }, []);

  // Keep selectedJob in sync with jobs state
  const currentSelectedJob = selectedJob
    ? (jobs.find((j) => j.id === selectedJob.id) ?? selectedJob)
    : null;

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 pt-6 pb-4 space-y-4">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalJobs} total ·{" "}
              <span className="font-mono">{appliedCount}</span> in progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh / scan button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5 border-slate-200"
            >
              <motion.span
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isRefreshing
                    ? { repeat: Infinity, duration: 1, ease: "linear" }
                    : { duration: 0 }
                }
                className="flex items-center"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </motion.span>
              {isRefreshing ? "Scanning…" : "Scan now"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-200"
              aria-label="Filter"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-slate-200"
              aria-label="View options"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <ScrollArea>
          <div className="flex items-center gap-3 pb-1">
            <StatCard
              label="Total tracked"
              value={totalJobs}
              color="text-slate-600"
              bg="bg-slate-100"
              icon={<Briefcase className="h-4 w-4" />}
            />
            <StatCard
              label="In progress"
              value={appliedCount}
              sub="applied + interview"
              color="text-blue-600"
              bg="bg-blue-50"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatCard
              label="Interviews"
              value={interviewCount}
              color="text-amber-600"
              bg="bg-amber-50"
              icon={
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
            <StatCard
              label="Offers"
              value={offerCount}
              color="text-emerald-600"
              bg="bg-emerald-50"
              icon={
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
            <StatCard
              label="Avg. match"
              value={`${avgMatchScore}%`}
              color="text-purple-600"
              bg="bg-purple-50"
              icon={
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              }
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by role, company, or tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white border-slate-200 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active search indicator */}
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground -mt-1"
          >
            Showing{" "}
            <span className="font-semibold text-foreground font-mono">
              {filteredJobs.length}
            </span>{" "}
            result{filteredJobs.length !== 1 ? "s" : ""} for &ldquo;
            {searchQuery}&rdquo;
          </motion.p>
        )}
      </div>

      {/* ── Kanban Board ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex items-start gap-5 px-6 pb-6 h-full min-h-150">
            {kanbanColumnMeta.map((col, index) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              >
                <KanbanColumn
                  column={col}
                  jobs={jobsByStatus[col.id]}
                  onJobClick={handleJobClick}
                />
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* ── Job Detail Sheet ──────────────────────────────────────────── */}
      <JobDetailSheet
        job={currentSelectedJob}
        open={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
        onJobUpdate={handleJobUpdate}
      />
    </div>
  );
}
