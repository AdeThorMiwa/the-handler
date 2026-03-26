import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Link,
  FileText,
  Globe,
  AlignLeft,
  X,
  Plus,
  File,
  CheckCircle2,
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

/** Strip HTML tags for plain-text previews */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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

// ── Resource List Item ────────────────────────────────────────────────────────

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
      exit={{ opacity: 0, x: -8, height: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="border-l-4 border-purple-400 bg-slate-50/70 rounded-r-lg px-4 py-3 flex items-start gap-3 group"
    >
      {/* Icon */}
      <div className="shrink-0 w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center mt-0.5">
        <Icon className="h-3.5 w-3.5 text-purple-500" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {resource.name}
          </p>
          <span className="text-xs font-mono text-muted-foreground shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
            {resourceTypeLabel[resource.type]}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
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

// ── Main Component ────────────────────────────────────────────────────────────

interface KnowledgeBaseProps {
  resources: Resource[];
  onResourcesChange: (resources: Resource[]) => void;
}

export default function KnowledgeBase({
  resources,
  onResourcesChange,
}: KnowledgeBaseProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isContextDialogOpen, setIsContextDialogOpen] = useState(false);
  // Store the TipTap HTML output
  const [contextHtml, setContextHtml] = useState("");
  const [contextTitle, setContextTitle] = useState("");

  const addResource = useCallback(
    (resource: Resource) => {
      onResourcesChange([...resources, resource]);
    },
    [resources, onResourcesChange],
  );

  const removeResource = useCallback(
    (id: string) => {
      onResourcesChange(resources.filter((r) => r.id !== id));
    },
    [resources, onResourcesChange],
  );

  // ── File handling ────────────────────────────────────────────────────────

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        const resource: Resource = {
          id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: "file",
          name: file.name,
          fileSize: file.size,
          mimeType: file.type,
          createdAt: new Date().toISOString(),
        };
        addResource(resource);
      });
    },
    [addResource],
  );

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

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ── URL handling ─────────────────────────────────────────────────────────

  const handleAddUrl = useCallback(() => {
    setUrlError("");
    const trimmed = urlValue.trim();

    if (!trimmed) {
      setUrlError("Please enter a URL.");
      return;
    }

    try {
      new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    } catch {
      setUrlError("That doesn't look like a valid URL.");
      return;
    }

    const normalised = trimmed.startsWith("http")
      ? trimmed
      : `https://${trimmed}`;

    let name = normalised;
    try {
      const { hostname, pathname } = new URL(normalised);
      name = hostname.replace(/^www\./, "");
      if (pathname && pathname !== "/") {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length > 0) name = `${name} / ${parts[parts.length - 1]}`;
      }
    } catch {
      /* keep raw url as name */
    }

    const resource: Resource = {
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: "url",
      name,
      url: normalised,
      createdAt: new Date().toISOString(),
    };

    addResource(resource);
    setUrlValue("");
  }, [urlValue, addResource]);

  // ── Manual context ────────────────────────────────────────────────────────

  const hasContent = stripHtml(contextHtml).trim().length > 0;

  const handleSaveContext = useCallback(() => {
    if (!hasContent) return;

    const resource: Resource = {
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: "manual",
      name: contextTitle.trim() || "Additional Context",
      content: contextHtml,
      createdAt: new Date().toISOString(),
    };

    addResource(resource);
    setContextHtml("");
    setContextTitle("");
    setIsContextDialogOpen(false);
  }, [hasContent, contextHtml, contextTitle, addResource]);

  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setContextHtml("");
      setContextTitle("");
    }
    setIsContextDialogOpen(open);
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Dropzone ────────────────────────────────────────────────────── */}
      <div>
        <Label className="mb-2 block">Resume & Documents</Label>
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

      {/* ── URL Input ───────────────────────────────────────────────────── */}
      <div>
        <Label className="mb-2 block">LinkedIn / Portfolio URL</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://linkedin.com/in/yourname"
              value={urlValue}
              onChange={(e) => {
                setUrlValue(e.target.value);
                if (urlError) setUrlError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddUrl();
              }}
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleAddUrl}
            className="gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        {urlError && (
          <p className="text-xs text-destructive mt-1.5">{urlError}</p>
        )}
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

      {/* ── Resource List ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">
                {resources.length} resource{resources.length !== 1 ? "s" : ""}{" "}
                added
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {resources.map((resource) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    onRemove={removeResource}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {resources.length === 0 && (
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
            {/* Title */}
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
              />
            </div>

            {/* Real TipTap editor */}
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDialogClose(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveContext}
              disabled={!hasContent}
              className="gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save context
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
