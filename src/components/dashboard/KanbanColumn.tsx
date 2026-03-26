import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import JobCard from "@/components/dashboard/JobCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Job, KanbanStatus } from "@/types";

interface ColumnMeta {
  id: KanbanStatus;
  title: string;
  color: string;
  accentColor: string;
  dotColor: string;
}

interface KanbanColumnProps {
  column: ColumnMeta;
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

export default function KanbanColumn({
  column,
  jobs,
  onJobClick,
}: KanbanColumnProps) {
  const isEmpty = jobs.length === 0;

  return (
    <div className="flex flex-col w-75 shrink-0 h-full">
      {/* ── Column header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          {/* Status dot */}
          <div
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              column.dotColor
            )}
          />

          {/* Column title */}
          <h2
            className={cn(
              "text-sm font-semibold tracking-tight",
              column.color
            )}
          >
            {column.title}
          </h2>
        </div>

        {/* Count badge */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center justify-center min-w-5 h-5 px-1.5",
              "rounded-full text-[11px] font-mono font-semibold",
              column.accentColor,
              column.color
            )}
          >
            {jobs.length}
          </span>

          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className={cn(
              "w-5 h-5 rounded-md flex items-center justify-center",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-slate-100 transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
            aria-label={`Add job to ${column.title}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>

      {/* ── Divider line ──────────────────────────────────────────────── */}
      <div
        className={cn(
          "h-0.5 rounded-full mb-3 opacity-60",
          column.accentColor
        )}
      />

      {/* ── Cards container ───────────────────────────────────────────── */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="pr-2 pb-4">
          {isEmpty ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center justify-center py-10 px-4 text-center"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full mb-3 flex items-center justify-center",
                  column.accentColor
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 border-dashed",
                    column.dotColor.replace("bg-", "border-")
                  )}
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                No jobs here yet
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">
                Jobs will appear here as they move through your pipeline.
              </p>
            </motion.div>
          ) : (
            /* Job cards */
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.22,
                      delay: index * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <JobCard job={job} onClick={onJobClick} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
