// ── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
}

// ── Knowledge Base Resources ─────────────────────────────────────────────────

export type ResourceType = "file" | "url" | "manual";

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  content?: string;
  url?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

// ── Job Directories ───────────────────────────────────────────────────────────

export type DirectoryStatus = "connected" | "disconnected" | "coming_soon";

export interface JobDirectory {
  id: string;
  name: string;
  logoUrl?: string;
  status: DirectoryStatus;
  connectedAt?: string;
}

// ── Preferences ───────────────────────────────────────────────────────────────

export type WorkModality = "remote" | "onsite" | "hybrid";
export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export interface PreferencesFormValues {
  jobSearchTime: string;
  applicationDelayMinutes: number;
  minApplicationsPerDay: number;
  maxApplicationsPerDay: number;
  preferredRoles: string[];
  organizationBlacklist: string[];
  minSalary: number;
  currency: Currency;
  modalities: WorkModality[];
  countries: string[];
  autoApply: boolean;
}

// ── Kanban & Jobs ─────────────────────────────────────────────────────────────

export type KanbanStatus =
  | "saved"
  | "applied"
  | "interview"
  | "declined"
  | "offer";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  location: string;
  salary?: string;
  jobType: WorkModality;
  matchScore: number; // 0-100
  status: KanbanStatus;
  description?: string;
  requirements?: string[];
  sourceUrl?: string;
  sourceDirectory?: string;
  dateFound: string;
  dateApplied?: string;
  dateUpdated: string;
  tailoredResumeUrl?: string;
  notes?: string;
  activityLog: ActivityEntry[];
  tags?: string[];
}

// ── Activity Timeline ─────────────────────────────────────────────────────────

export type ActivityType =
  | "status_change"
  | "resume_tailored"
  | "application_sent"
  | "interview_scheduled"
  | "note_added"
  | "email_received"
  | "offer_received"
  | "declined";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

// ── Kanban Column ─────────────────────────────────────────────────────────────

export interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  color: string;
  accentColor: string;
  jobs: Job[];
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export type OnboardingStep = 1 | 2 | 3;

export interface OnboardingState {
  currentStep: OnboardingStep;
  resources: Resource[];
  connectedDirectories: string[];
  preferences?: Partial<PreferencesFormValues>;
}

// ── App Views ─────────────────────────────────────────────────────────────────

export type AppView = "auth" | "onboarding" | "dashboard";

// ── Match Score Helper ────────────────────────────────────────────────────────

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-500";
}

export function getMatchScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}
