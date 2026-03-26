import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getMatchScoreBg } from "@/types";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

function formatRelativeDate(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getCompanyInitials(company: string): string {
  return company
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const modalityLabel: Record<string, string> = {
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

const modalityColors: Record<string, string> = {
  remote: "text-emerald-600 bg-emerald-50",
  onsite: "text-blue-600 bg-blue-50",
  hybrid: "text-amber-600 bg-amber-50",
};

export default function JobCard({ job, onClick }: JobCardProps) {
  const scoreBg = getMatchScoreBg(job.matchScore);
  const initials = getCompanyInitials(job.company);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2, boxShadow: "0 4px 16px 0 rgb(0 0 0 / 0.07)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(job)}
      className={cn(
        "w-full text-left bg-white rounded-xl border border-slate-100 shadow-sm",
        "p-4 space-y-3 cursor-pointer group",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "transition-colors hover:border-slate-200"
      )}
    >
      {/* Header row — company + match score */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Company avatar */}
          <Avatar className="h-7 w-7 rounded-lg shrink-0">
            <AvatarImage src={job.companyLogoUrl} alt={job.company} />
            <AvatarFallback
              className={cn(
                "rounded-lg text-[10px] font-bold",
                "bg-slate-100 text-slate-600"
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="text-xs font-medium text-muted-foreground truncate">
            {job.company}
          </span>
        </div>

        {/* Match score badge */}
        <span
          className={cn(
            "text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border shrink-0",
            scoreBg
          )}
        >
          {job.matchScore}%
        </span>
      </div>

      {/* Job title */}
      <div>
        <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {job.title}
        </h3>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Location */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate max-w-25">{job.location.split("(")[0].trim()}</span>
        </div>

        {/* Modality pill */}
        <span
          className={cn(
            "text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full",
            modalityColors[job.jobType] ?? "text-slate-600 bg-slate-50"
          )}
        >
          {modalityLabel[job.jobType] ?? job.jobType}
        </span>
      </div>

      {/* Footer row — salary + date */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        {/* Salary */}
        {job.salary ? (
          <span className="text-[11px] font-mono text-muted-foreground truncate max-w-30">
            {job.salary.replace("$", "").replace(",000", "k").replace(" –", "–")}
          </span>
        ) : (
          <span className="text-[11px] font-mono text-muted-foreground/50">
            Salary TBD
          </span>
        )}

        {/* Date + source indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Calendar className="h-3 w-3 text-muted-foreground/60" />
          <span className="text-[11px] font-mono text-muted-foreground/70">
            {formatRelativeDate(job.dateApplied ?? job.dateFound)}
          </span>
        </div>
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap -mt-1">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-[10px] font-mono text-muted-foreground/60">
              +{job.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* "View details" hover hint */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 -mt-1">
        <ExternalLink className="h-3 w-3 text-primary/60" />
        <span className="text-[11px] text-primary/70 font-medium">
          View details
        </span>
      </div>
    </motion.button>
  );
}
