import type { Job, Resource, JobDirectory } from "@/types";

// ── Mock Resources ────────────────────────────────────────────────────────────

export const mockResources: Resource[] = [
  {
    id: "res-1",
    type: "file",
    name: "Adeola_Thormiwa_Resume_2025.pdf",
    fileSize: 184320,
    mimeType: "application/pdf",
    createdAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "res-2",
    type: "url",
    name: "LinkedIn Profile",
    url: "https://linkedin.com/in/adethormiwa",
    createdAt: "2025-01-10T09:05:00Z",
  },
  {
    id: "res-3",
    type: "url",
    name: "Portfolio / GitHub",
    url: "https://github.com/adethormiwa",
    createdAt: "2025-01-10T09:07:00Z",
  },
  {
    id: "res-4",
    type: "manual",
    name: "Additional Context",
    content:
      "Senior frontend engineer with 6+ years of experience specialising in React, TypeScript, and design systems. Passionate about developer tooling, performance optimisation, and building products at the intersection of design and engineering.",
    createdAt: "2025-01-10T09:15:00Z",
  },
];

// ── Mock Directories ──────────────────────────────────────────────────────────

export const mockDirectories: JobDirectory[] = [
  {
    id: "dir-linkedin",
    name: "LinkedIn",
    status: "connected",
    connectedAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "dir-indeed",
    name: "Indeed",
    status: "coming_soon",
  },
  {
    id: "dir-wellfound",
    name: "Wellfound",
    status: "coming_soon",
  },
];

// ── Mock Jobs ─────────────────────────────────────────────────────────────────

export const mockJobs: Job[] = [
  // ── Saved ──────────────────────────────────────────────────────────────────
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    company: "Linear",
    location: "Remote (US)",
    salary: "$160,000 – $200,000",
    jobType: "remote",
    matchScore: 94,
    status: "saved",
    description:
      "Build the next generation of project management tooling. You'll work closely with product and design to craft pixel-perfect experiences used by thousands of engineering teams worldwide.",
    requirements: [
      "5+ years of React experience",
      "Strong TypeScript skills",
      "Eye for design and detail",
      "Experience with performance optimisation",
    ],
    sourceUrl: "https://linear.app/jobs",
    sourceDirectory: "LinkedIn",
    dateFound: "2025-01-14T08:30:00Z",
    dateUpdated: "2025-01-14T08:30:00Z",
    tags: ["React", "TypeScript", "Design Systems"],
    activityLog: [
      {
        id: "act-1-1",
        type: "resume_tailored",
        title: "Resume tailored",
        description: "AI generated a tailored resume highlighting design system experience.",
        timestamp: "2025-01-14T08:32:00Z",
      },
    ],
  },
  {
    id: "job-2",
    title: "Staff Engineer, Design Systems",
    company: "Vercel",
    location: "Remote (Global)",
    salary: "$180,000 – $230,000",
    jobType: "remote",
    matchScore: 88,
    status: "saved",
    description:
      "Own and evolve Vercel's internal design system powering vercel.com, the dashboard, and internal tooling. Partner with brand, design, and platform teams.",
    requirements: [
      "Experience owning a design system",
      "Next.js expertise",
      "CSS-in-JS and Tailwind fluency",
    ],
    sourceUrl: "https://vercel.com/careers",
    sourceDirectory: "LinkedIn",
    dateFound: "2025-01-13T14:00:00Z",
    dateUpdated: "2025-01-13T14:00:00Z",
    tags: ["Next.js", "Design Systems", "Staff"],
    activityLog: [
      {
        id: "act-2-1",
        type: "resume_tailored",
        title: "Resume tailored",
        description: "Emphasised design system ownership and Next.js projects.",
        timestamp: "2025-01-13T14:05:00Z",
      },
    ],
  },
  {
    id: "job-3",
    title: "Frontend Engineer II",
    company: "Loom",
    location: "San Francisco, CA / Remote",
    salary: "$140,000 – $170,000",
    jobType: "hybrid",
    matchScore: 76,
    status: "saved",
    description:
      "Work on the core recording and playback experience. Build highly interactive video components used by millions of async communicators.",
    requirements: [
      "3+ years React",
      "WebRTC or media experience a plus",
      "Performance-focused mindset",
    ],
    sourceUrl: "https://loom.com/jobs",
    sourceDirectory: "LinkedIn",
    dateFound: "2025-01-12T10:00:00Z",
    dateUpdated: "2025-01-12T10:00:00Z",
    tags: ["React", "Video", "WebRTC"],
    activityLog: [],
  },

  // ── Applied ────────────────────────────────────────────────────────────────
  {
    id: "job-4",
    title: "Senior Product Engineer",
    company: "Figma",
    location: "Remote (US/EU)",
    salary: "$170,000 – $220,000",
    jobType: "remote",
    matchScore: 91,
    status: "applied",
    description:
      "Join Figma's product engineering team to build collaborative design tools at scale. You'll work on real-time features, plugin infrastructure, and developer-facing APIs.",
    requirements: [
      "Expert-level TypeScript & React",
      "Interest in collaboration tooling",
      "Experience with WebAssembly or CRDT a plus",
    ],
    sourceUrl: "https://figma.com/careers",
    sourceDirectory: "LinkedIn",
    dateFound: "2025-01-08T11:00:00Z",
    dateApplied: "2025-01-09T09:15:00Z",
    dateUpdated: "2025-01-09T09:15:00Z",
    tailoredResumeUrl: "#",
    tags: ["React", "TypeScript", "Collaborative"],
    notes:
      "Applied via LinkedIn Easy Apply. The JD mentioned CRDT which aligns with my side project on conflict-free data structures. Highlighted that in cover letter.",
    activityLog: [
      {
        id: "act-4-1",
        type: "resume_tailored",
        title: "Resume tailored",
        description:
          "AI emphasised real-time collaboration work and design tooling background.",
        timestamp: "2025-01-08T11:10:00Z",
      },
      {
        id: "act-4-2",
        type: "application_sent",
        title: "Application submitted",
        description: "Applied via LinkedIn Easy Apply with tailored resume.",
        timestamp: "2025-01-09T09:15:00Z",
      },
    ],
  },
  {
    id: "job-5",
    title: "Senior Software Engineer – Frontend Platform",
    company: "Notion",
    location: "New York, NY / Remote",
    salary: "$155,000 – $195,000",
    jobType: "hybrid",
    matchScore: 83,
    status: "applied",
    description:
      "Build the infrastructure that powers Notion's web application. Work on bundling, performance, and developer experience for one of the most complex SPAs on the web.",
    requirements: [
      "Deep knowledge of browser performance",
      "Webpack / esbuild / Vite experience",
      "React internals familiarity",
    ],
    sourceUrl: "https://notion.so/careers",
    sourceDirectory: "LinkedIn",
    dateFound: "2025-01-07T16:00:00Z",
    dateApplied: "2025-01-08T10:00:00Z",
    dateUpdated: "2025-01-08T10:00:00Z",
    tailoredResumeUrl: "#",
    tags: ["Platform", "Performance", "Bundling"],
    activityLog: [
      {
        id: "act-5-1",
        type: "resume_tailored",
        title: "Resume tailored",
        description: "Highlighted webpack/Vite migration projects and performance wins.",
        timestamp: "2025-01-07T16:15:00Z",
      },
      {
        id: "act-5-2",
        type: "application_sent",
        title: "Application submitted",
        description: "Applied through Notion's careers portal.",
        timestamp: "2025-01-08T10:00:00Z",
      },
      {
        id: "act-5-3",
        type: "email_received",
        title: "Confirmation email received",
        description: "Automated acknowledgement from Notion Talent team.",
        timestamp: "2025-01-08T10:05:00Z",
      },
    ],
  },

  // ── Interview ──────────────────────────────────────────────────────────────
  {
    id: "job-6",
    title: "Lead Frontend Engineer",
    company: "Clerk",
    location: "Remote (Global)",
    salary: "$150,000 – $185,000",
    jobType: "remote",
    matchScore: 89,
    status: "interview",
    description:
      "Lead frontend development across Clerk's dashboard, documentation site, and component library. Own the DX for auth components used by 50,000+ developers.",
    requirements: [
      "Leadership track record",
      "Auth / security domain knowledge a plus",
      "Strong written communication",
    ],
    sourceUrl: "https://clerk.com/careers",
    sourceDirectory: "LinkedIn",
    dateFound: "2025-01-02T09:00:00Z",
    dateApplied: "2025-01-03T10:30:00Z",
    dateUpdated: "2025-01-11T15:00:00Z",
    tailoredResumeUrl: "#",
    tags: ["Lead", "Auth", "DX"],
    notes:
      "Passed initial screen. Technical interview scheduled for Jan 16. Need to review Clerk's component API and recent changelog.",
    activityLog: [
      {
        id: "act-6-1",
        type: "resume_tailored",
        title: "Resume tailored",
        description: "Emphasised leadership experience and component library ownership.",
        timestamp: "2025-01-02T09:10:00Z",
      },
      {
        id: "act-6-2",
        type: "application_sent",
        title: "Application submitted",
        timestamp: "2025-01-03T10:30:00Z",
      },
      {
        id: "act-6-3",
        type: "email_received",
        title: "Recruiter outreach",
        description: "Amara from Clerk talent team reached out to schedule a screen.",
        timestamp: "2025-01-06T14:00:00Z",
      },
      {
        id: "act-6-4",
        type: "interview_scheduled",
        title: "Technical interview scheduled",
        description: "60-min technical interview with the frontend lead on Jan 16.",
        timestamp: "2025-01-11T15:00:00Z",
        metadata: { date: "Jan 16, 2025 – 2:00 PM EST", interviewer: "Jordan Lee" },
      },
    ],
  },
  {
    id: "job-7",
    title: "Senior React Engineer",
    company: "Resend",
    location: "Remote (Global)",
    salary: "$130,000 – $160,000",
    jobType: "remote",
    matchScore: 85,
    status: "interview",
    description:
      "Help build the developer experience layer for Resend's email platform. Work on the dashboard, React Email editor, and public APIs.",
    requirements: [
      "Strong React & TypeScript skills",
      "Familiarity with email rendering quirks",
      "Product-minded engineer",
    ],
    sourceUrl: "https://resend.com/careers",
    sourceDirectory: "LinkedIn",
    dateFound: "2025-01-05T08:00:00Z",
    dateApplied: "2025-01-06T09:00:00Z",
    dateUpdated: "2025-01-12T11:00:00Z",
    tailoredResumeUrl: "#",
    tags: ["React", "Email", "DX"],
    activityLog: [
      {
        id: "act-7-1",
        type: "application_sent",
        title: "Application submitted",
        timestamp: "2025-01-06T09:00:00Z",
      },
      {
        id: "act-7-2",
        type: "interview_scheduled",
        title: "Intro call scheduled",
        description: "30-min intro with Guilherme Ramalho (founder).",
        timestamp: "2025-01-12T11:00:00Z",
        metadata: { date: "Jan 17, 2025 – 10:00 AM EST" },
      },
    ],
  },

  // ── Declined ───────────────────────────────────────────────────────────────
  {
    id: "job-8",
    title: "Frontend Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    salary: "$180,000 – $240,000",
    jobType: "onsite",
    matchScore: 68,
    status: "declined",
    description:
      "Build Stripe's financial infrastructure UIs — dashboards, reporting tools, and developer documentation.",
    requirements: ["5+ years experience", "Onsite San Francisco required"],
    sourceUrl: "https://stripe.com/jobs",
    sourceDirectory: "LinkedIn",
    dateFound: "2024-12-20T10:00:00Z",
    dateApplied: "2024-12-21T11:00:00Z",
    dateUpdated: "2025-01-05T09:00:00Z",
    tailoredResumeUrl: "#",
    tags: ["FinTech", "Onsite"],
    activityLog: [
      {
        id: "act-8-1",
        type: "application_sent",
        title: "Application submitted",
        timestamp: "2024-12-21T11:00:00Z",
      },
      {
        id: "act-8-2",
        type: "declined",
        title: "Application declined",
        description:
          "Stripe moved forward with other candidates. Relocation was a blocker.",
        timestamp: "2025-01-05T09:00:00Z",
      },
    ],
  },

  // ── Offer ──────────────────────────────────────────────────────────────────
  {
    id: "job-9",
    title: "Senior Frontend Engineer",
    company: "Supabase",
    location: "Remote (Global)",
    salary: "$145,000 – $175,000",
    jobType: "remote",
    matchScore: 92,
    status: "offer",
    description:
      "Build the next generation of Supabase Studio — the open source database platform used by 1M+ developers. Work on the dashboard, CLI tooling, and SDK documentation.",
    requirements: [
      "Strong React & TypeScript",
      "Open source experience valued",
      "Async-first communication",
    ],
    sourceUrl: "https://supabase.com/careers",
    sourceDirectory: "LinkedIn",
    dateFound: "2024-12-15T09:00:00Z",
    dateApplied: "2024-12-16T10:00:00Z",
    dateUpdated: "2025-01-13T17:00:00Z",
    tailoredResumeUrl: "#",
    tags: ["Open Source", "Database", "Remote"],
    notes:
      "Verbal offer received on Jan 13. Reviewing comp package. Base is slightly below target but equity + async culture is very appealing. Need to respond by Jan 20.",
    activityLog: [
      {
        id: "act-9-1",
        type: "resume_tailored",
        title: "Resume tailored",
        description: "Highlighted open source contributions and async work experience.",
        timestamp: "2024-12-15T09:15:00Z",
      },
      {
        id: "act-9-2",
        type: "application_sent",
        title: "Application submitted",
        timestamp: "2024-12-16T10:00:00Z",
      },
      {
        id: "act-9-3",
        type: "interview_scheduled",
        title: "System design interview",
        description: "90-min system design + coding interview.",
        timestamp: "2024-12-28T14:00:00Z",
        metadata: { date: "Jan 3, 2025 – 11:00 AM UTC" },
      },
      {
        id: "act-9-4",
        type: "interview_scheduled",
        title: "Culture & values chat",
        description: "45-min conversation with the team lead.",
        timestamp: "2025-01-06T10:00:00Z",
        metadata: { date: "Jan 9, 2025 – 3:00 PM UTC" },
      },
      {
        id: "act-9-5",
        type: "offer_received",
        title: "Offer received 🎉",
        description:
          "Verbal offer: $155k base + 0.15% equity (4yr vest). Respond by Jan 20.",
        timestamp: "2025-01-13T17:00:00Z",
      },
    ],
  },
];

// ── Kanban Column Metadata ────────────────────────────────────────────────────

export const kanbanColumnMeta = [
  {
    id: "saved" as const,
    title: "Saved",
    color: "text-slate-600",
    accentColor: "bg-slate-100",
    dotColor: "bg-slate-400",
  },
  {
    id: "applied" as const,
    title: "Applied",
    color: "text-blue-600",
    accentColor: "bg-blue-50",
    dotColor: "bg-blue-400",
  },
  {
    id: "interview" as const,
    title: "Interview",
    color: "text-amber-600",
    accentColor: "bg-amber-50",
    dotColor: "bg-amber-400",
  },
  {
    id: "declined" as const,
    title: "Declined",
    color: "text-rose-500",
    accentColor: "bg-rose-50",
    dotColor: "bg-rose-400",
  },
  {
    id: "offer" as const,
    title: "Offer",
    color: "text-emerald-600",
    accentColor: "bg-emerald-50",
    dotColor: "bg-emerald-500",
  },
] as const;

// ── Preferred Roles (for multi-select) ───────────────────────────────────────

export const roleOptions = [
  "Senior Frontend Engineer",
  "Staff Frontend Engineer",
  "Lead Frontend Engineer",
  "Frontend Architect",
  "Senior Full-Stack Engineer",
  "Senior React Engineer",
  "Product Engineer",
  "UI Engineer",
  "Design Engineer",
  "Senior Software Engineer",
];

// ── Country options (subset) ──────────────────────────────────────────────────

export const countryOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "Netherlands",
  "France",
  "Australia",
  "Remote (Global)",
];
