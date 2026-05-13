export type Project = {
  name: string;
  role: string;
  tech: string;
  period: string;
  image: string;
};

const under25: Project = {
  name: "Under 25",
  role: "Mobile Developer",
  tech: "Flutter",
  period: "2024 - present",
  image: "/images/under25.png",
};

export const projects: Project[] = Array(10).fill(under25);
