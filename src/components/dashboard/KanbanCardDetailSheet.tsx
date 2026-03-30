import { useState, useCallback, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  Download,
  CheckCircle2,
  Send,
  Mail,
  CalendarClock,
  TrendingUp,
  MessageSquare,
  Gift,
  XCircle,
  Sparkles,
  Building2,
  Globe,
  DollarSign,
  Rocket,
} from "lucide-react";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";
import { getMatchScoreBg } from "@/types";
import type { ActivityEntry, ActivityType } from "@/types";
import type { Application } from "@/services/application";
import ApplicationService from "@/services/application";
import _ from "lodash";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(iso);
}

function getCompanyInitials(company: string): string {
  return company
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const statusLabels: Record<Application["status"], string> = {
  ready: "Saved",
  applied: "Applied",
  interview: "Interview",
  declined: "Declined",
  offer: "Offer",
};

const statusColors: Record<Application["status"], string> = {
  ready: "bg-slate-100 text-slate-600 border-slate-200",
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  interview: "bg-amber-50 text-amber-700 border-amber-200",
  declined: "bg-rose-50 text-rose-600 border-rose-200",
  offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const modalityLabel: Record<string, string> = {
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

// ── Activity Icon & Color Map ─────────────────────────────────────────────────

function getActivityIcon(type: ActivityType) {
  const map: Record<
    ActivityType,
    { icon: typeof CheckCircle2; color: string; bg: string }
  > = {
    status_change: {
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    resume_tailored: {
      icon: Sparkles,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    application_sent: { icon: Send, color: "text-blue-600", bg: "bg-blue-50" },
    interview_scheduled: {
      icon: CalendarClock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    note_added: {
      icon: MessageSquare,
      color: "text-slate-500",
      bg: "bg-slate-100",
    },
    email_received: {
      icon: Mail,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    offer_received: {
      icon: Gift,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    declined: { icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
  };
  return (
    map[type] ?? {
      icon: CheckCircle2,
      color: "text-slate-500",
      bg: "bg-slate-100",
    }
  );
}

function ActivityTimeline({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3">
          <Clock className="h-5 w-5 text-slate-300" />
        </div>
        <p className="text-sm text-muted-foreground">No activity yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Events will appear here as your application progresses.
        </p>
      </div>
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3.75 top-2 bottom-2 w-px bg-border" />

      <div className="space-y-5">
        {sorted.map((entry, index) => {
          const { icon: Icon, color, bg } = getActivityIcon(entry.type);
          const isFirst = index === 0;

          return (
            <div
              key={entry.id}
              className="relative flex items-start gap-3.5 pl-1"
            >
              {/* Icon bubble */}
              <div
                className={cn(
                  "relative z-10 shrink-0 w-7 h-7 rounded-full flex items-center justify-center ring-2 ring-background",
                  bg,
                  isFirst && "ring-primary/20",
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium text-foreground leading-snug",
                      isFirst && "text-foreground",
                    )}
                  >
                    {entry.title}
                  </p>
                  <span className="text-[11px] font-mono text-muted-foreground shrink-0 mt-0.5">
                    {formatRelativeTime(entry.timestamp)}
                  </span>
                </div>

                {entry.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {entry.description}
                  </p>
                )}

                {/* Metadata pills */}
                {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(entry.metadata).map(([key, val]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 text-[11px] font-mono bg-muted border border-border px-2 py-0.5 rounded-md text-muted-foreground"
                      >
                        <span className="capitalize text-foreground/60">
                          {key}:
                        </span>
                        {val}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResumePreview({ resumeUrl }: { resumeUrl: string }) {
  if (!resumeUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
          <FileText className="h-6 w-6 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          No tailored resume yet
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1 max-w-50">
          Career OS will generate a tailored resume when this job is applied to.
        </p>
        <Button size="sm" variant="outline" className="mt-4 gap-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          Generate now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Preview card */}
      <div className="relative rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {/* Fake PDF header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded bg-slate-900" />
              <div className="h-2.5 w-28 rounded bg-slate-300" />
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-20 rounded bg-slate-200" />
                <div className="h-2 w-16 rounded bg-slate-200" />
                <div className="h-2 w-24 rounded bg-slate-200" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">AT</span>
            </div>
          </div>
        </div>

        {/* Fake content sections */}
        <div className="px-6 py-4 space-y-4">
          {[
            { label: "Experience", lines: [40, 32, 28, 35, 24] },
            { label: "Skills", lines: [20, 24, 18, 22] },
          ].map((section) => (
            <div key={section.label}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-16 rounded bg-primary/60" />
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="space-y-1.5">
                {section.lines.map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-slate-100"
                    style={{ width: `${w * 2}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI-tailored watermark */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-purple-50 text-purple-600 border border-purple-100 px-1.5 py-0.5 rounded-full">
            <Sparkles className="h-2.5 w-2.5" />
            AI-tailored
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1.5 text-xs"
          asChild
        >
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            View PDF
          </a>
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
        <Button size="sm" variant="soft" className="gap-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          Re-generate
        </Button>
      </div>
    </div>
  );
}

interface NotesEditorProps {
  initialValue: string;
  onSave: (html: string) => void;
  /** Called when the user sends a log entry via the Send button or ⌘Enter */
  onLog: (html: string) => void;
}

function NotesEditor({ initialValue, onSave, onLog }: NotesEditorProps) {
  const handleChange = useCallback((html: string) => {
    console.log({ html });
  }, []);

  const handleSave = useCallback(
    (html: string) => {
      onSave(html);
    },
    [onSave],
  );

  // Called by RichTextEditor when user clicks Send / presses ⌘Enter.
  // The editor clears itself automatically after calling this.
  const handleSend = useCallback(
    (html: string) => {
      onLog(html);
      // Reset the save-state indicator so it doesn't show stale "Saved"
    },
    [onLog],
  );

  return (
    <div>
      <RichTextEditor
        initialContent={initialValue}
        placeholder="Log a note, update, or next step — press ⌘Enter or click Send to post it to the activity timeline…"
        onChange={handleChange}
        onSave={handleSave}
        onSend={handleSend}
        showSendButton={true}
        minHeight="100px"
        showWordCount={true}
        className="border-purple-100 focus-within:ring-purple-300/40"
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface KanbanCardDetailSheetProps {
  application: Application;
  open: boolean;
  onClose: VoidFunction;
  onApplicationUpdate?: (application: Application) => void;
}

export default function KanbanCardDetailSheet({
  application,
  open,
  onClose,
  onApplicationUpdate,
}: KanbanCardDetailSheetProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [applying, setApplying] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);

  // Reset to overview tab whenever a different item is opened
  useEffect(() => {
    if (open) {
      setActiveTab("overview");
    }
  }, [application?.id, open]);

  const handleNoteSave = useCallback(
    (html: string) => {
      console.log({ html });
      if (application && onApplicationUpdate) {
        onApplicationUpdate({ ...application });
      }
    },
    [application, onApplicationUpdate],
  );

  /**
   * Called when the user clicks "Send" (or presses ⌘Enter) in the log editor.
   * Creates a `note_added` ActivityEntry from the HTML content, appends it to
   * the job's activityLog, and switches to the Activity tab so the user can
   * immediately see their new entry in the timeline.
   */
  const handleLog = useCallback((html: string) => {
    // Strip tags to get a plain-text description for the timeline entry
    const plainText = html
      .replace(/<[^>]*>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!plainText) return;

    const entry = {
      id: `act-log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "note_added" as const,
      title: "Log entry added",
      description:
        plainText.length > 400 ? `${plainText.slice(0, 397)}…` : plainText,
      timestamp: new Date().toISOString(),
    };

    setActivityLog((logs) => [...logs, entry]);

    // Navigate to Activity tab so the user sees the newly posted entry
    setActiveTab("activity");
  }, []);

  const applyNow = useCallback(async () => {
    setApplying(true);

    try {
      await ApplicationService.apply(application.id);
    } finally {
      setApplying(false);
    }
  }, [application.id]);

  if (!application) return null;

  const scoreBg = getMatchScoreBg(application.match_score);
  const initials = getCompanyInitials(application.job.company);

  return (
    <Sheet open={open} onClose={onClose}>
      <SheetHeader>
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9 rounded-xl shrink-0">
            <AvatarImage alt={application.job.company} />
            <AvatarFallback className="rounded-xl text-xs font-bold bg-slate-100 text-slate-600">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <SheetTitle className="truncate">
              {application.job.title}
            </SheetTitle>
            <SheetDescription>{application.job.company}</SheetDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span
            className={cn(
              "text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border",
              statusColors[application.status],
            )}
          >
            {statusLabels[application.status]}
          </span>

          <span
            className={cn(
              "text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border",
              scoreBg,
            )}
          >
            {application.match_score}% match
          </span>

          <SheetClose onClose={onClose} />
        </div>
      </SheetHeader>

      {/* ── Sheet Body ────────────────────────────────────────────────── */}
      <SheetContent className="space-y-0 px-0 py-0">
        {/* Job meta row */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border flex flex-wrap items-center gap-x-5 gap-y-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{application.job.location}</span>
          </div>

          {/* Modality */}
          {application.job.modalities?.map((modality, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span>{modalityLabel[modality] ?? modality}</span>
            </div>
          ))}

          {/* Salary */}
          {application.job.minimum_salary && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono">
                {application.job.minimum_salary}
              </span>
            </div>
          )}

          {/* Source */}
          {application.job.source && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>{application.job.source}</span>
            </div>
          )}

          {/* Date found */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="font-mono">Found {application.job.posted_at}</span>
          </div>

          {/* Date applied */}
          {application.applied_at && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono">
                Applied {formatDate(application.applied_at)}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {/*{item.tags && item.tags.length > 0 && (
          <div className="px-6 py-3 flex items-center gap-1.5 flex-wrap border-b border-border">
            <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}*/}

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="h-8">
              <TabsTrigger value="overview" className="text-xs px-3 h-6">
                Overview
              </TabsTrigger>
              <TabsTrigger value="resume" className="text-xs px-3 h-6">
                Resume
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Overview Tab ──────────────────────────────────────────── */}
          <TabsContent
            value="overview"
            className="flex-1 overflow-y-auto px-6 py-5 space-y-6 mt-0"
          >
            {/* Description */}
            {application.job.description && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  About the role
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {application.job.description}
                </p>
              </section>
            )}

            {/* Requirements */}
            {/*{item.requirements && item.requirements.length > 0 && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Requirements
                </h4>
                <ul className="space-y-1.5">
                  {item.requirements.map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}*/}

            {/* Source link */}
            {application.job.external_url && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Original posting
                </h4>
                <a
                  href={application.job.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on {_.capitalize(application.job.source)}
                </a>
              </section>
            )}

            {!application.applied_at && (
              <section>
                <Button
                  size="lg"
                  onClick={applyNow}
                  disabled={applying}
                  className="gap-2 min-w-40"
                >
                  <Rocket className="h-4 w-4" />
                  Apply now
                </Button>
              </section>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">
                  Activities
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {activityLog.length}{" "}
                  {activityLog.length === 1 ? "event" : "events"}
                </span>
              </div>

              <ActivityTimeline entries={activityLog} />

              <NotesEditor
                key={`activity-${application.id}`}
                initialValue={""}
                onSave={handleNoteSave}
                onLog={handleLog}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="resume"
            className="flex-1 overflow-y-auto px-6 py-5 mt-0"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Tailored resume
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AI-generated specifically for this role based on your
                    knowledge base.
                  </p>
                </div>
                {application.applied_at && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Generated {formatDateTime(application.applied_at)}
                  </span>
                )}
              </div>

              <ResumePreview resumeUrl={application.resume_url} />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
