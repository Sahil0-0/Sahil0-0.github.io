export type Project = {
  name: string;
  image: string;
  tags: string[];
  span?: number;
  year: number;
};

export const projects: Project[] = [
  { name: "Under 25", image: "/images/dev/under25.png", tags: ["work", "code"], year: 2024 },
  { name: "Bruised Passports", image: "/images/dev/bp.png", tags: ["work", "code"], span: 2, year: 2024 },
  { name: "Chronos", image: "/images/dev/chronos.png", tags: ["projects","work", "code"], year: 2023 },
  { name: "Balcony", image: "/images/arts/balcony.jpeg", tags: ["art", "design"], year: 2023 },
  { name: "Loser", image: "/images/arts/loser.jpeg", tags: ["art", "design"], year: 2023 },
  { name: "Smokes", image: "/images/arts/smokes.jpeg", tags: ["art", "design"], year: 2022 },
];
