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
    span:2,
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
    span:2,
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
    span:2,
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

const TRACK_SIZE = 4;
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
 
function tightRowShapes(wideCount: number, squareCount: number, fullRows: number, remainderUnits: number) {
  const shapes: Array<{ pairs: number; mixed: number; squares: number }> = [];
  for (let pairs = 0; pairs * 2 <= wideCount; pairs++) {
    for (let mixed = 0; mixed <= wideCount - pairs * 2; mixed++) {
      const squares = fullRows - pairs - mixed;
      if (squares < 0) continue;
      const squaresUsed = mixed * 2 + squares * TRACK_SIZE;
      if (squaresUsed > squareCount) continue;
      const wideLeft = wideCount - pairs * 2 - mixed;
      const squareLeft = squareCount - squaresUsed;
      if (wideLeft > 1) continue;
      if (wideLeft * 2 + squareLeft !== remainderUnits) continue;
      shapes.push({ pairs, mixed, squares });
    }
  }
  return shapes;
}

export function packBySpan<T extends { span?: number }>(items: T[], seed = 0): T[] {
  const rand = mulberry32(seed);
  const wide = shuffle(items.filter((p) => (p.span ?? 1) === 2), rand);
  const square = shuffle(items.filter((p) => (p.span ?? 1) === 1), rand);

  const totalUnits = wide.length * 2 + square.length;
  if (totalUnits === 0) return [];

  const fullRows = Math.floor(totalUnits / TRACK_SIZE);
  const remainderUnits = totalUnits % TRACK_SIZE;
  const shapes = tightRowShapes(wide.length, square.length, fullRows, remainderUnits);
  if (!shapes.length) return [...wide, ...square];
  const { pairs, mixed } = shapes[Math.floor(rand() * shapes.length)];

  const rows: T[][] = [];
  let w = 0;
  let s = 0;
  for (let i = 0; i < pairs; i++) rows.push([wide[w++], wide[w++]]);
  for (let i = 0; i < mixed; i++) {
    rows.push(shuffle([wide[w++], square[s++], square[s++]], rand));
  }
  while (s + TRACK_SIZE - 1 < square.length) {
    rows.push(square.slice(s, s + TRACK_SIZE));
    s += TRACK_SIZE;
  }

  const remainder = [...wide.slice(w), ...square.slice(s)];
  const ordered = shuffle(rows, rand);
  if (remainder.length) ordered.push(shuffle(remainder, rand));

  return ordered.flat();
}
