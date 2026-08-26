export type Project = {
  name: string;
  image: string;
  tags: string[];
  span?: number;
  year: number;
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "Under 25",
    image: "/images/dev/under25.png",
    tags: ["work", "code"],
    year: 2024,
    stack: ["Flutter", "Firebase"],
  },
  {
    name: "Bruised Passports",
    image: "/images/dev/bp.png",
    tags: ["work", "code"],
    span: 2,
    year: 2024,
    stack: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    name: "Chronos",
    image: "/images/dev/chronos.png",
    tags: ["projects", "work", "code"],
    year: 2023,
    stack: ["React Native", "TypeScript"],
  },
  {
    name: "Balcony",
    image: "/images/arts/balcony.jpeg",
    tags: ["art", "design"],
    year: 2023,
    stack: ["Watercolor"],
  },
  {
    name: "Loser",
    image: "/images/arts/loser.jpeg",
    tags: ["art", "design"],
    year: 2023,
    stack: ["Pencil"],
  },
  {
    name: "Smokes",
    image: "/images/arts/smokes.jpeg",
    tags: ["art", "design"],
    year: 2022,
    stack: ["Charcoal"],
  },
  {
    name: "Zephyr",
    image: "/images/dev/zephyr.png",
    tags: ["projects", "code"],
    year: 2024,
    stack: ["Vue", "Node.js"],
  },
  {
    name: "Neon Nights",
    image: "/images/arts/neon-nights.jpeg",
    tags: ["art", "design"],
    span: 2,
    year: 2024,
    stack: ["Digital", "Procreate"],
  },
  {
    name: "Inkwell",
    image: "/images/dev/inkwell.png",
    tags: ["projects", "code"],
    year: 2023,
    stack: ["Swift", "SwiftUI"],
  },
  {
    name: "Solstice",
    image: "/images/arts/solstice.jpeg",
    tags: ["art", "design"],
    year: 2023,
    stack: ["Watercolor"],
  },
  {
    name: "Quark",
    image: "/images/dev/quark.png",
    tags: ["projects", "code"],
    year: 2023,
    stack: ["Python", "Django"],
  },
  {
    name: "Blueprint",
    image: "/images/arts/blueprint.jpeg",
    tags: ["art", "design"],
    span: 2,
    year: 2022,
    stack: ["Ink", "Pen"],
  },
  {
    name: "Mosaic",
    image: "/images/dev/mosaic.png",
    tags: ["work", "code"],
    year: 2024,
    stack: ["React", "Next.js"],
  },
  {
    name: "Fluid",
    image: "/images/arts/fluid.jpeg",
    tags: ["art", "design"],
    year: 2022,
    stack: ["Acrylic"],
  },
  {
    name: "Drift",
    image: "/images/dev/drift.png",
    tags: ["projects", "code"],
    year: 2025,
    stack: ["Flutter", "Dart"],
  },
  {
    name: "Grunge",
    image: "/images/arts/grunge.jpeg",
    tags: ["art", "design"],
    year: 2022,
    stack: ["Mixed Media"],
  },
  {
    name: "Parallax",
    image: "/images/dev/parallax.png",
    tags: ["work", "code"],
    span: 2,
    year: 2025,
    stack: ["React", "Three.js"],
  },
  {
    name: "Mirage",
    image: "/images/arts/mirage.jpeg",
    tags: ["art", "design"],
    year: 2023,
    stack: ["Oil Pastel"],
  },
  {
    name: "Orbit",
    image: "/images/dev/orbit.png",
    tags: ["projects", "code"],
    year: 2025,
    stack: ["Kotlin", "Jetpack Compose"],
  },
  {
    name: "Ash",
    image: "/images/arts/ash.jpeg",
    tags: ["art", "design"],
    span: 2,
    year: 2024,
    stack: ["Charcoal"],
  },
  {
    name: "Vessel",
    image: "/images/dev/vessel.png",
    tags: ["work", "code"],
    year: 2025,
    stack: ["Next.js", "TypeScript"],
  },
  {
    name: "Glitch",
    image: "/images/arts/glitch.jpeg",
    tags: ["art", "design"],
    year: 2022,
    stack: ["Digital", "Procreate"],
  },
  {
    name: "Strata",
    image: "/images/dev/strata.png",
    tags: ["projects", "code"],
    year: 2023,
    stack: ["Go", "PostgreSQL"],
  },
  {
    name: "Dusk",
    image: "/images/arts/dusk.jpeg",
    tags: ["art", "design"],
    year: 2024,
    stack: ["Watercolor"],
  },
  {
    name: "Cipher",
    image: "/images/dev/cipher.png",
    tags: ["work", "code"],
    span: 2,
    year: 2025,
    stack: ["Rust", "WebAssembly"],
  },
  {
    name: "Rust",
    image: "/images/arts/rust.jpeg",
    tags: ["art", "design"],
    year: 2022,
    stack: ["Acrylic"],
  },
  {
    name: "Beacon",
    image: "/images/dev/beacon.png",
    tags: ["projects", "code"],
    year: 2024,
    stack: ["React", "Node.js"],
  },
  {
    name: "Hollow",
    image: "/images/arts/hollow.jpeg",
    tags: ["art", "design"],
    year: 2023,
    stack: ["Pencil"],
  },
  {
    name: "Tempo",
    image: "/images/dev/tempo.png",
    tags: ["work", "code"],
    year: 2025,
    stack: ["Flutter", "Firebase"],
  },
];

export function getUnique(...tags: string[]) {
  const seen = new Set<string>();
  return projects.filter((p) => {
    if (!tags.every((t) => p.tags.includes(t))) return false;
    if (seen.has(p.image)) return false;
    seen.add(p.image);
    return true;
  });
}
