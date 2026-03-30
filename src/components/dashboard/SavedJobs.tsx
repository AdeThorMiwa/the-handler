import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Rocket } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import JobApplicationCard from "./JobApplicationCard";
import { useCallback, useState, type FC } from "react";
import type { Application } from "@/services/application";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ApplicationService from "@/services/application";
import Spinner from "../ui/spinner";

const column = {
  id: "saved" as const,
  title: "Saved",
  color: "text-slate-600",
  accentColor: "bg-slate-100",
  dotColor: "bg-slate-400",
};

interface SavedJobsKanbanColumnProps {
  applications: Application[];
  onApplicationClick: (application: Application) => void;
}

const SavedJobsKanbanColumn: FC<SavedJobsKanbanColumnProps> = ({
  applications,
  onApplicationClick,
}) => {
  const isEmpty = applications.length === 0;
  const [applying, setApplying] = useState(false);

  const applyToAll = useCallback(async () => {
    setApplying(true);
    try {
      await ApplicationService.applyToAllPending();
    } finally {
      setApplying(false);
    }
  }, []);

  return (
    <motion.div
      key={column.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: 0 * 0.06,
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
              {applications.length}
            </span>

            {/* Add button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className={cn(
                    "w-5 h-5 cursor-pointer rounded-md flex items-center justify-center",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-slate-100 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  )}
                  aria-label={`Apply to all`}
                  onClick={applyToAll}
                >
                  {applying ? <Spinner /> : <Rocket className="h-3.5 w-3.5" />}
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>Apply to all</TooltipContent>
            </Tooltip>
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
                  No jobs saved yet
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  Jobs will appear here as we search the web for you.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {applications.map((application, index) => (
                    <motion.div
                      key={application.id}
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
};

export default SavedJobsKanbanColumn;
