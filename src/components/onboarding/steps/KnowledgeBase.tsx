import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Globe,
  AlignLeft,
  X,
  Plus,
  File,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import KnowledgeBaseService from "@/services/knowledge";
import type { Resource, ResourceType } from "@/types";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred. Please try again.";
}

// ── Type maps ─────────────────────────────────────────────────────────────────

const resourceTypeIcon: Record<ResourceType, typeof FileText> = {
  file: FileText,
  url: Globe,
  manual: AlignLeft,
};

const resourceTypeLabel: Record<ResourceType, string> = {
  file: "Document",
  url: "Link",
  manual: "Context",
};

type UploadStatus = "uploading" | "error";

interface PendingUpload {
  tempId: string;
  file: File;
  status: UploadStatus;
  errorMessage?: string;
}

interface PendingUploadItemProps {
  upload: PendingUpload;
  onRetry: (tempId: string) => void;
  onDismiss: (tempId: string) => void;
}

function PendingUploadItem({
  upload,
  onRetry,
  onDismiss,
}: PendingUploadItemProps) {
  const isUploading = upload.status === "uploading";
  const isError = upload.status === "error";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "border-l-4 rounded-r-lg px-4 py-3 flex items-start gap-3 group",
        isUploading && "border-purple-300 bg-purple-50/50",
        isError && "border-rose-400 bg-rose-50/50",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "shrink-0 w-7 h-7 rounded-md flex items-center justify-center mt-0.5",
          isUploading && "bg-purple-100",
          isError && "bg-rose-100",
        )}
      >
        {isUploading && (
          <Loader2 className="h-3.5 w-3.5 text-purple-500 animate-spin" />
        )}
        {isError && <AlertCircle className="h-3.5 w-3.5 text-rose-500" />}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-foreground truncate">
            {upload.file.name}
          </p>
          <span
            className={cn(
              "text-xs font-mono shrink-0 px-1.5 py-0.5 rounded",
              isUploading && "bg-purple-100 text-purple-600",
              isError && "bg-rose-100 text-rose-600",
            )}
          >
            {isUploading ? "Uploading…" : "Failed"}
          </span>
        </div>

        <p className="text-xs font-mono text-muted-foreground mt-0.5">
          {formatFileSize(upload.file.size)}
        </p>

        {isError && upload.errorMessage && (
          <p className="text-xs text-rose-600 mt-1 leading-snug">
            {upload.errorMessage}
          </p>
        )}
      </div>

      {/* Actions (error only) */}
      {isError && (
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <button
            type="button"
            onClick={() => onRetry(upload.tempId)}
            className="inline-flex items-center gap-1 h-6 px-2 rounded text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
          <button
            type="button"
            onClick={() => onDismiss(upload.tempId)}
            className="w-6 h-6 rounded flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}

interface ResourceItemProps {
  resource: Resource;
  onRemove: (id: string) => void;
}

function ResourceItem({ resource, onRemove }: ResourceItemProps) {
  const Icon = resourceTypeIcon[resource.type];
  const preview = resource.content ? stripHtml(resource.content) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="border-l-4 border-purple-400 bg-slate-50/70 rounded-r-lg px-4 py-3 flex items-start gap-3 group"
    >
      {/* Icon */}
      <div className="shrink-0 w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center mt-0.5">
        <Icon className="h-3.5 w-3.5 text-purple-500" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-foreground truncate">
            {resource.name}
          </p>
          <span className="text-xs font-mono text-muted-foreground shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
            {resourceTypeLabel[resource.type]}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {resource.url && (
            <p className="text-xs text-muted-foreground truncate font-mono">
              {resource.url}
            </p>
          )}
          {resource.fileSize !== undefined && (
            <p className="text-xs font-mono text-muted-foreground">
              {formatFileSize(resource.fileSize)}
            </p>
          )}
          {preview && (
            <p className="text-xs text-muted-foreground truncate">
              {preview.slice(0, 72)}
              {preview.length > 72 ? "…" : ""}
            </p>
          )}
        </div>

        <p className="text-xs font-mono text-muted-foreground/70 mt-1">
          Added {formatDate(resource.createdAt)}
        </p>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(resource.id)}
        className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all"
      >
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Remove</span>
      </button>
    </motion.div>
  );
}

interface KnowledgeBaseProps {
  resources: Resource[];
  onAddResource: (resource: Resource) => void;
  onRemoveResource: (id: string) => void;
}

export default function KnowledgeBase({
  resources,
  onAddResource,
  onRemoveResource,
}: KnowledgeBaseProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);

  const [isContextDialogOpen, setIsContextDialogOpen] = useState(false);
  const [contextHtml, setContextHtml] = useState("");
  const [contextTitle, setContextTitle] = useState("");
  const [isContextSaving, setIsContextSaving] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);

  const hasContent = stripHtml(contextHtml).trim().length > 0;

  const runUpload = useCallback(
    (tempId: string, file: File) => {
      KnowledgeBaseService.upload(file.name, file)
        .then((result) => {
          // Move from pending → confirmed resource
          onAddResource({
            id: result.id,
            type: "file",
            name: result.label,
            fileSize: file.size,
            mimeType: file.type,
            createdAt: result.last_updated,
          });
          setPendingUploads((prev) => prev.filter((u) => u.tempId !== tempId));
        })
        .catch((err: unknown) => {
          setPendingUploads((prev) =>
            prev.map((u) =>
              u.tempId === tempId
                ? {
                    ...u,
                    status: "error" as const,
                    errorMessage: getErrorMessage(err),
                  }
                : u,
            ),
          );
        });
    },
    [onAddResource],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const incoming: PendingUpload[] = Array.from(files).map((file) => ({
        tempId: `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${file.name}`,
        file,
        status: "uploading" as const,
      }));

      // Batch-add all pending items at once (single state update)
      setPendingUploads((prev) => [...prev, ...incoming]);

      // Kick off each upload independently
      incoming.forEach(({ tempId, file }) => runUpload(tempId, file));
    },
    [runUpload],
  );

  const handleRetryUpload = useCallback(
    (tempId: string) => {
      const pending = pendingUploads.find((u) => u.tempId === tempId);
      if (!pending) return;

      // Reset back to uploading state
      setPendingUploads((prev) =>
        prev.map((u) =>
          u.tempId === tempId
            ? { ...u, status: "uploading" as const, errorMessage: undefined }
            : u,
        ),
      );

      runUpload(tempId, pending.file);
    },
    [pendingUploads, runUpload],
  );

  const handleDismissPending = useCallback((tempId: string) => {
    setPendingUploads((prev) => prev.filter((u) => u.tempId !== tempId));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleSaveContext = useCallback(async () => {
    if (!hasContent) return;

    setIsContextSaving(true);
    setContextError(null);

    try {
      const label = contextTitle.trim() || "Additional Context";
      // Send plain text to the API; keep HTML locally for rich display
      const plainContent = stripHtml(contextHtml);

      const result = await KnowledgeBaseService.add(label, plainContent);

      onAddResource({
        id: result.id,
        type: "manual",
        name: result.label,
        content: contextHtml, // preserve HTML for preview
        createdAt: result.last_updated,
      });

      setContextHtml("");
      setContextTitle("");
      setIsContextDialogOpen(false);
    } catch (err) {
      setContextError(getErrorMessage(err));
    } finally {
      setIsContextSaving(false);
    }
  }, [hasContent, contextHtml, contextTitle, onAddResource]);

  const handleResourceRemoval = useCallback(
    async (id: string) => {
      try {
        await KnowledgeBaseService.delete(id);
        onRemoveResource(id);
      } catch (err) {
        setContextError(getErrorMessage(err));
      }
    },
    [onRemoveResource],
  );

  const handleDialogClose = useCallback(
    (open: boolean) => {
      if (isContextSaving) return; // block close while saving
      if (!open) {
        setContextHtml("");
        setContextTitle("");
        setContextError(null);
      }
      setIsContextDialogOpen(open);
    },
    [isContextSaving],
  );

  const uploadingCount = pendingUploads.filter(
    (u) => u.status === "uploading",
  ).length;
  const errorCount = pendingUploads.filter((u) => u.status === "error").length;
  const totalVisible = resources.length + pendingUploads.length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Dropzone ────────────────────────────────────────────────────── */}
      <div>
        <Label className="mb-2 block">Resume &amp; Documents</Label>
        <motion.div
          animate={{
            borderColor: isDragging ? "rgb(168 85 247)" : "rgb(203 213 225)",
            backgroundColor: isDragging
              ? "rgb(250 245 255)"
              : "rgb(248 250 252)",
          }}
          transition={{ duration: 0.15 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-shadow hover:shadow-sm"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload files by clicking or dragging and dropping"
        >
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3"
          >
            <Upload
              className={`h-5 w-5 transition-colors ${
                isDragging ? "text-purple-500" : "text-purple-400"
              }`}
            />
          </motion.div>

          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or{" "}
            <span className="text-primary font-medium underline underline-offset-2">
              browse
            </span>{" "}
            to upload
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2 font-mono">
            PDF, DOCX, TXT — up to 10 MB
          </p>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-hidden="true"
        />
      </div>

      {/* ── Manual Context ───────────────────────────────────────────────── */}
      <div>
        <Label className="mb-2 block">Additional Context</Label>
        <button
          type="button"
          onClick={() => setIsContextDialogOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 hover:border-purple-300 hover:bg-purple-50/30 transition-all group text-left"
        >
          <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
            <AlignLeft className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-500 transition-colors" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Write additional context
            </p>
            <p className="text-xs text-muted-foreground">
              Skills summary, career goals, anything the AI should know
            </p>
          </div>
          <Plus className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* ── Resource + pending list ──────────────────────────────────────── */}
      <AnimatePresence>
        {totalVisible > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header row */}
            <div className="flex items-center gap-2 mb-3">
              {uploadingCount > 0 ? (
                <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
              ) : errorCount > 0 ? (
                <AlertCircle className="h-4 w-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              <span className="text-sm font-medium text-foreground">
                {resources.length}{" "}
                {resources.length === 1 ? "resource" : "resources"} added
                {uploadingCount > 0 && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · {uploadingCount} uploading
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="text-rose-600 font-normal">
                    {" "}
                    · {errorCount} failed
                  </span>
                )}
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {/* Confirmed resources */}
                {resources.map((resource) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    onRemove={handleResourceRemoval}
                  />
                ))}

                {/* In-progress + error uploads */}
                {pendingUploads.map((upload) => (
                  <PendingUploadItem
                    key={upload.tempId}
                    upload={upload}
                    onRetry={handleRetryUpload}
                    onDismiss={handleDismissPending}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state hint ─────────────────────────────────────────────── */}
      {totalVisible === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <File className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">
            Add at least your resume to help the AI tailor applications for you.
          </p>
        </div>
      )}

      {/* ── Manual Context Dialog ────────────────────────────────────────── */}
      <Dialog open={isContextDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Write Additional Context</DialogTitle>
            <DialogDescription>
              Share anything that isn&apos;t in your resume — career goals,
              preferred stack, soft skills, or personal projects.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title field */}
            <div>
              <Label htmlFor="context-title" className="mb-1.5 block">
                Title{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="context-title"
                placeholder="e.g. Career goals & soft skills"
                value={contextTitle}
                onChange={(e) => setContextTitle(e.target.value)}
                disabled={isContextSaving}
              />
            </div>

            {/* TipTap editor */}
            <div>
              <Label className="mb-1.5 block">Content</Label>
              <RichTextEditor
                placeholder="I'm a senior frontend engineer with 6+ years of experience in React and TypeScript. I'm particularly passionate about design systems and developer tooling…"
                onChange={setContextHtml}
                minHeight="160px"
                showWordCount={true}
                autoFocus={false}
              />
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {contextError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-100"
                >
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-rose-700">
                      Failed to save
                    </p>
                    <p className="text-xs text-rose-600 mt-0.5">
                      {contextError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContextError(null)}
                    className="text-rose-400 hover:text-rose-600 transition-colors shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDialogClose(false)}
              disabled={isContextSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveContext}
              disabled={!hasContent || isContextSaving}
              className="gap-1.5 min-w-30"
            >
              {isContextSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Save context
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
