export type Project = {
  id: string;
  name: string;
  tagline: string;
  category: "dev" | "design" | "artwork";
  role: string;
  tech: string[];
  period: string;
  bgGradient: string;
};

export const FILTERS = [
  { label: "just dev", value: "dev" },
  { label: "a little design", value: "design" },
  { label: "some artworks", value: "artwork" },
  { label: "projects only", value: "all" },
] as const;

export type FilterValue = (typeof FILTERS)[number]["value"];

export const PROJECTS: Project[] = [
  {
    id: "under-25",
    name: "Under 25",
    tagline: "There's always more to learn",
    category: "dev",
    role: "Mobile Developer",
    tech: ["Flutter"],
    period: "2024 – present",
    bgGradient: "from-slate-900 via-blue-950 to-black",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    tagline: "One pixel at a time",
    category: "dev",
    role: "Frontend Developer",
    tech: ["Next.js", "TypeScript"],
    period: "2025",
    bgGradient: "from-zinc-900 via-emerald-950 to-black",
  },
  {
    id: "visual-system",
    name: "Visual System",
    tagline: "Design is never done",
    category: "design",
    role: "UI Designer",
    tech: ["Figma"],
    period: "2024",
    bgGradient: "from-zinc-900 via-purple-950 to-black",
  },
  {
    id: "artwork-01",
    name: "Artwork 01",
    tagline: "Make things that feel alive",
    category: "artwork",
    role: "Digital Artist",
    tech: ["Procreate"],
    period: "2024",
    bgGradient: "from-stone-900 via-rose-950 to-black",
  },
];
