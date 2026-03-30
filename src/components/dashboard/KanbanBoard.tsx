import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Search, RefreshCw } from "lucide-react";
import KanbanCardDetailSheet from "@/components/dashboard/KanbanCardDetailSheet";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useStats } from "@/hooks/useStats";
import SavedJobsKanbanColumn from "./SavedJobs";
import ApplicationKanbanColumns from "./Applications";
import { useApplications } from "@/hooks/useApplications";
import type { Application } from "@/services/application";
import Button from "../ui/button";
import ApplicationService from "@/services/application";

interface KanbanBoardProps {
  className?: string;
}

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

export default function KanbanBoard({ className }: KanbanBoardProps) {
  const { applications, saved } = useApplications();
  const [selectedApplication, setSelectedApplication] = useState<Application>();
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);

  const filteredSavedApplications = useMemo(
    () =>
      searchQuery.trim()
        ? saved.filter(
            (application) =>
              application.job.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              application.job.company
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          )
        : saved,
    [searchQuery, saved],
  );

  const filteredApplications = useMemo(
    () =>
      searchQuery.trim()
        ? applications.filter(
            (application) =>
              application.job.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              application.job.company
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          )
        : applications,
    [searchQuery, applications],
  );

  const onApplicationUpdate = useCallback((application: Application) => {
    console.log({ application });
  }, []);

  const {
    totalApplications,
    totalSaved,
    autoApplySuccessRate,
    averageResponseTimeInDays,
    declined,
  } = useStats();

  const totalTracked = totalApplications + totalSaved;
  const totalInProgress = totalApplications - declined;

  const onApplicationClick = useCallback((application: Application) => {
    setSelectedApplication(application);
  }, []);

  const onScan = useCallback(async () => {
    setScanning(true);
    try {
      await ApplicationService.scan();
    } finally {
      setScanning(false);
    }
  }, []);

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      <div className="shrink-0 px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalTracked} total ·{" "}
              <span className="font-mono">{totalInProgress}</span> in progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onScan}
              disabled={scanning}
              className="gap-1.5 border-slate-200"
            >
              <motion.span
                animate={scanning ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  scanning
                    ? { repeat: Infinity, duration: 1, ease: "linear" }
                    : { duration: 0 }
                }
                className="flex items-center"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </motion.span>
              {scanning ? "Scanning…" : "Scan now"}
            </Button>
            {/*<Button
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
            </Button>*/}
          </div>
        </div>

        <ScrollArea>
          <div className="flex items-center gap-3 pb-1">
            <StatCard
              label="Total tracked"
              value={totalTracked}
              color="text-slate-600"
              bg="bg-slate-100"
              icon={<Briefcase className="h-4 w-4" />}
            />
            <StatCard
              label="Avg. response time"
              value={`${averageResponseTimeInDays} days`}
              color="text-blue-600"
              bg="bg-blue-50"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatCard
              label="Auto apply success rate"
              value={`${autoApplySuccessRate}%`}
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

        {searchQuery && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-muted-foreground -mt-1"
          >
            Showing{" "}
            <span className="font-semibold text-foreground font-mono">
              {filteredSavedApplications.length}
            </span>{" "}
            result{filteredSavedApplications.length !== 1 ? "s" : ""} for
            &ldquo;
            {searchQuery}&rdquo;
          </motion.p>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex items-start gap-5 px-6 pb-6 h-full min-h-150">
            <SavedJobsKanbanColumn
              applications={filteredSavedApplications}
              onApplicationClick={onApplicationClick}
            />
            <ApplicationKanbanColumns
              applications={filteredApplications}
              onApplicationClick={onApplicationClick}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {selectedApplication && (
        <KanbanCardDetailSheet
          application={selectedApplication!}
          open={!!selectedApplication}
          onClose={() => setSelectedApplication(undefined)}
          onApplicationUpdate={onApplicationUpdate}
        />
      )}
    </div>
  );
}
