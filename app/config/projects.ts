export type Project = {
  name: string;
  image: string;
  tags: string[];
  span?: number;
  year: number;
};

export const projects: Project[] = [
  {
    name: "Under 25",
    image: "/images/dev/under25.png",
    tags: ["work", "code"],
    year: 2024,
  },
  {
    name: "Bruised Passports",
    image: "/images/dev/bp.png",
    tags: ["work", "code"],
    span: 2,
    year: 2024,
  },
  {
    name: "Chronos",
    image: "/images/dev/chronos.png",
    tags: ["projects", "work", "code"],
    year: 2023,
  },
  {
    name: "Balcony",
    image: "/images/arts/balcony.jpeg",
    tags: ["art", "design"],
    year: 2023,
  },
  {
    name: "Loser",
    image: "/images/arts/loser.jpeg",
    tags: ["art", "design"],
    year: 2023,
  },
  {
    name: "Smokes",
    image: "/images/arts/smokes.jpeg",
    tags: ["art", "design"],
    year: 2022,
  },
  {
    name: "Zephyr",
    image: "/images/dev/zephyr.png",
    tags: ["projects", "code"],
    year: 2024,
  },
  {
    name: "Neon Nights",
    image: "/images/arts/neon-nights.jpeg",
    tags: ["art", "design"],
    span: 2,
    year: 2024,
  },
  {
    name: "Inkwell",
    image: "/images/dev/inkwell.png",
    tags: ["projects", "code"],
    year: 2023,
  },
  {
    name: "Solstice",
    image: "/images/arts/solstice.jpeg",
    tags: ["art", "design"],
    year: 2023,
  },
  {
    name: "Quark",
    image: "/images/dev/quark.png",
    tags: ["projects", "code"],
    year: 2023,
  },
  {
    name: "Blueprint",
    image: "/images/arts/blueprint.jpeg",
    tags: ["art", "design"],
    span: 2,
    year: 2022,
  },
  {
    name: "Mosaic",
    image: "/images/dev/mosaic.png",
    tags: ["work", "code"],
    year: 2024,
  },
  {
    name: "Fluid",
    image: "/images/arts/fluid.jpeg",
    tags: ["art", "design"],
    year: 2022,
  },
  {
    name: "Drift",
    image: "/images/dev/drift.png",
    tags: ["projects", "code"],
    year: 2025,
  },
  {
    name: "Grunge",
    image: "/images/arts/grunge.jpeg",
    tags: ["art", "design"],
    year: 2022,
  },
  {
    name: "Parallax",
    image: "/images/dev/parallax.png",
    tags: ["work", "code"],
    span: 2,
    year: 2025,
  },
  {
    name: "Mirage",
    image: "/images/arts/mirage.jpeg",
    tags: ["art", "design"],
    year: 2023,
  },
  {
    name: "Orbit",
    image: "/images/dev/orbit.png",
    tags: ["projects", "code"],
    year: 2025,
  },
  {
    name: "Ash",
    image: "/images/arts/ash.jpeg",
    tags: ["art", "design"],
    span: 2,
    year: 2024,
  },
  {
    name: "Vessel",
    image: "/images/dev/vessel.png",
    tags: ["work", "code"],
    year: 2025,
  },
  {
    name: "Glitch",
    image: "/images/arts/glitch.jpeg",
    tags: ["art", "design"],
    year: 2022,
  },
  {
    name: "Strata",
    image: "/images/dev/strata.png",
    tags: ["projects", "code"],
    year: 2023,
  },
  {
    name: "Dusk",
    image: "/images/arts/dusk.jpeg",
    tags: ["art", "design"],
    year: 2024,
  },
  {
    name: "Cipher",
    image: "/images/dev/cipher.png",
    tags: ["work", "code"],
    span: 2,
    year: 2025,
  },
  {
    name: "Rust",
    image: "/images/arts/rust.jpeg",
    tags: ["art", "design"],
    year: 2022,
  },
  {
    name: "Beacon",
    image: "/images/dev/beacon.png",
    tags: ["projects", "code"],
    year: 2024,
  },
  {
    name: "Hollow",
    image: "/images/arts/hollow.jpeg",
    tags: ["art", "design"],
    year: 2023,
  },
  {
    name: "Tempo",
    image: "/images/dev/tempo.png",
    tags: ["work", "code"],
    year: 2025,
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
