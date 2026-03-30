import type { Resource } from "@/types";

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

export const kanbanColumnMeta = [
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
];

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
