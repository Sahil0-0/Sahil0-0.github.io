export type Project = {
  name: string;
  role: string;
  tech: string;
  period: string;
  image: string;
  category: string;
};

const under25: Project = {
  name: "Under 25",
  role: "Mobile Developer",
  tech: "Flutter",
  period: "2024 - present",
  image: "/images/under25Work.png",
  category: "Mobile",
};

const bruisedPassports: Project = {
  name: "Bruised Passports",
  role: "Mobile Developer",
  tech: "Flutter",
  period: "2024 - present",
  image: "/images/bruisedPassports.png",
  category: "Mobile",
};

const base: Project[] = [under25, bruisedPassports];
export const projects: Project[] = Array.from({ length: 10 }, (_, i) => base[i % 2]);
