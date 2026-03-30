import { kanbanColumnMeta } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import JobApplicationCard from "@/components/dashboard/JobApplicationCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMemo, type FC } from "react";
import { type KanbanStatus } from "@/types";
import type { Application } from "@/services/application";

interface ApplicationKanbanColumnsProps {
  applications: Application[];
  onApplicationClick: (application: Application) => void;
}

const ApplicationKanbanColumns: FC<ApplicationKanbanColumnsProps> = ({
  applications,
  onApplicationClick,
}) => {
  const applicationByStatus = useMemo(
    () =>
      kanbanColumnMeta.reduce<Record<KanbanStatus, Application[]>>(
        (acc, col) => {
          acc[col.id] = applications.filter((j) => j.status === col.id);
          return acc;
        },
        {
          saved: [],
          applied: [],
          interview: [],
          declined: [],
          offer: [],
        },
      ),
    [applications],
  );

  return kanbanColumnMeta.map((column, index) => {
    const columnApplications = applicationByStatus[column.id];
    const isEmpty = columnApplications.length === 0;

    return (
      <motion.div
        key={column.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: (index + 1) * 0.06,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-full"
      >
        <div className="flex flex-col w-75 shrink-0 h-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div
                className={cn("w-2 h-2 rounded-full shrink-0", column.dotColor)}
              />

              <h2
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  column.color,
                )}
              >
                {column.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-5 h-5 px-1.5",
                  "rounded-full text-[11px] font-mono font-semibold",
                  column.accentColor,
                  column.color,
                )}
              >
                {columnApplications.length}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "h-0.5 rounded-full mb-3 opacity-60",
              column.accentColor,
            )}
          />

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="pr-2 pb-4">
              {isEmpty ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col items-center justify-center py-10 px-4 text-center"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full mb-3 flex items-center justify-center",
                      column.accentColor,
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 border-dashed",
                        column.dotColor.replace("bg-", "border-"),
                      )}
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    No application here yet
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Applications will appear here as they move through your
                    pipeline.
                  </p>
                </motion.div>
              ) : (
                /* Job cards */
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {columnApplications.map((application, index) => (
                      <motion.div
                        key={application.job.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{
                          duration: 0.22,
                          delay: (index + 1) * 0.04,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <JobApplicationCard
                          application={application}
                          onClick={onApplicationClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </motion.div>
    );
  });
};

export default ApplicationKanbanColumns;
