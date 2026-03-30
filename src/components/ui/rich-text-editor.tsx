import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts a plain-text string to minimal HTML paragraphs so TipTap can
 * render pre-existing notes that were stored as plain text.
 * If the string already looks like HTML it is returned as-is.
 */
function normaliseContent(content?: string): string {
  if (!content) return "";
  const trimmed = content.trim();
  if (trimmed.startsWith("<")) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// ── Toolbar button ────────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
  className,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        // Prevent the editor from losing focus when clicking toolbar buttons
        e.preventDefault();
        if (!disabled) onClick();
      }}
      className={cn(
        "inline-flex items-center justify-center rounded h-6 w-6 text-xs font-semibold",
        "transition-colors duration-100",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        isActive
          ? "bg-foreground/10 text-foreground"
          : "text-muted-foreground hover:bg-foreground/8 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-4 bg-border mx-0.5 shrink-0" />;
}

// ── RichTextEditor ────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  /** Initial content – plain text or HTML string */
  initialContent?: string;
  /** Placeholder shown when the editor is empty */
  placeholder?: string;
  /** Called on every keystroke with the current HTML */
  onChange?: (html: string) => void;
  /** Called when the user explicitly saves (⌘S / Ctrl+S) */
  onSave?: (html: string) => void;
  /**
   * Called when the user clicks "Send" or presses ⌘Enter / Ctrl+Enter.
   * After firing, the editor clears itself automatically.
   */
  onSend?: (html: string) => void;
  /** Show a "Send" button in the footer (requires onSend to be wired) */
  showSendButton?: boolean;
  /** Minimum height of the editable area (CSS value, e.g. "120px") */
  minHeight?: string;
  /** Extra classes applied to the outer wrapper div */
  className?: string;
  /** Whether to show the word / character count footer */
  showWordCount?: boolean;
  /** Whether to auto-focus the editor on mount */
  autoFocus?: boolean;
}

export function RichTextEditor({
  initialContent,
  placeholder = "Start writing…",
  onChange,
  onSave,
  onSend,
  showSendButton = false,
  minHeight = "100px",
  className,
  showWordCount = true,
  autoFocus = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the code-block shortcut so it doesn't interfere
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      CharacterCount,
    ],
    content: normaliseContent(initialContent),
    autofocus: autoFocus ? "end" : false,
    editorProps: {
      attributes: {
        class: "ProseMirror tiptap-wrapper text-sm text-foreground",
        spellcheck: "true",
      },
      handleKeyDown(_view, event) {
        if ((event.metaKey || event.ctrlKey) && event.key === "s") {
          event.preventDefault();
          return true; // handled – actual save fired via onUpdate below
        }
        return false;
      },
    },
    onUpdate({ editor: ed }) {
      const html = ed.getHTML();
      onChange?.(html);
    },
  });

  // ── Send handler (⌘Enter / Send button) ────────────────────────────────────
  const handleSend = React.useCallback(() => {
    if (!editor || !onSend) return;
    const text = editor.getText().trim();
    if (!text) return;
    const html = editor.getHTML();
    onSend(html);
    // Clear the editor and reset onChange tracking
    editor.commands.clearContent(true);
    onChange?.("");
    editor.commands.focus();
  }, [editor, onSend, onChange]);

  // ── Keyboard shortcuts on the outer wrapper ─────────────────────────────────
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "s") {
        e.preventDefault();
        if (editor) onSave?.(editor.getHTML());
      }
      if (mod && e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    [editor, onSave, handleSend],
  );

  // Expose a ref-style way for parents to imperatively get the HTML
  // (not needed right now but keeps the API ergonomic)

  const wordCount = editor?.storage.characterCount?.words() ?? 0;
  const charCount = editor?.storage.characterCount?.characters() ?? 0;
  // Derived: is there any meaningful content to send/save?
  const hasContent = charCount > 0;

  const isDisabled = !editor;

  return (
    <div
      className={cn(
        "rounded-lg border border-input overflow-hidden bg-background",
        "focus-within:ring-1 focus-within:ring-ring transition-shadow",
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/40 border-b border-input select-none">
        {/* Text formatting */}
        <ToolbarButton
          title="Bold (⌘B)"
          isActive={editor?.isActive("bold") ?? false}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          title="Italic (⌘I)"
          isActive={editor?.isActive("italic") ?? false}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          title="Underline (⌘U)"
          isActive={editor?.isActive("underline") ?? false}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block type */}
        <ToolbarButton
          title="Normal text"
          isActive={
            !editor?.isActive("heading") &&
            !editor?.isActive("bulletList") &&
            !editor?.isActive("orderedList")
          }
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().setParagraph().run()}
          className="w-auto px-1.5 text-[11px] font-mono tracking-tight"
        >
          ¶
        </ToolbarButton>

        <ToolbarButton
          title="Heading 1"
          isActive={editor?.isActive("heading", { level: 1 }) ?? false}
          disabled={isDisabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="w-auto px-1.5 text-[11px] font-semibold"
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          isActive={editor?.isActive("heading", { level: 2 }) ?? false}
          disabled={isDisabled}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="w-auto px-1.5 text-[11px] font-semibold"
        >
          H2
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          title="Bullet list"
          isActive={editor?.isActive("bulletList") ?? false}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered list"
          isActive={editor?.isActive("orderedList") ?? false}
          disabled={isDisabled}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Branding / hint */}
        <span className="text-[10px] font-mono text-muted-foreground/50 italic pr-0.5">
          TipTap
        </span>
      </div>

      {/* ── Editor area ──────────────────────────────────────────────── */}
      <div
        className="px-3 py-2.5 cursor-text"
        style={{ minHeight }}
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* ── Footer: word count + action hints / send button ──────────── */}
      {(showWordCount || (showSendButton && onSend)) && (
        <div className="flex items-center justify-between gap-3 px-3 py-1.5 border-t border-input bg-muted/20">
          {/* Left: counts */}
          {showWordCount && (
            <span className="text-[11px] font-mono text-muted-foreground/70 shrink-0">
              {wordCount} {wordCount === 1 ? "word" : "words"} &middot;{" "}
              {charCount} {charCount === 1 ? "char" : "chars"}
            </span>
          )}

          {/* Right: keyboard hints + send button */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* ⌘S hint when onSave is wired */}
            {onSave && !showSendButton && (
              <span className="text-[10px] font-mono text-muted-foreground/50 flex items-center gap-1">
                <kbd className="inline-flex items-center px-1 py-0 rounded border border-border bg-muted text-[9px]">
                  ⌘S
                </kbd>
                to save
              </span>
            )}

            {/* Send button */}
            {showSendButton && onSend && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // keep editor focus
                  handleSend();
                }}
                disabled={!hasContent}
                title="Send log entry (⌘Enter)"
                className={[
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md",
                  "text-[11px] font-semibold transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  hasContent
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                ].join(" ")}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-3 w-3 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M1.5 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .854.354L5 10.707V13.5a.5.5 0 0 0 .854.354l3-3a.5.5 0 0 0-.708-.708L6 12.293V10a.5.5 0 0 0-.146-.354L2.5 6.293V3.707l10.146 10.147a.5.5 0 0 0 .708-.708L2.5 2.354A.5.5 0 0 0 1.5 2z" />
                  <path d="M14.5 2a.5.5 0 0 0-.354.146L2.707 13.586 2 14.293V3.5a.5.5 0 0 0-1 0v12a.5.5 0 0 0 .854.354l12-12A.5.5 0 0 0 14.5 2z" />
                </svg>
                Send
                <kbd className="inline-flex items-center px-1 py-0 rounded border border-primary-foreground/30 bg-primary-foreground/10 text-[9px] font-mono ml-0.5">
                  ⌘↵
                </kbd>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
