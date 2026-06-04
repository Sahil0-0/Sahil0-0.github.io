"use client";

import { Project } from "@/app/config/projects";

type Props = { project: Project };

export default function ProjectAside({ project: _project }: Props) {
  return (
    <div className="w-full h-full bg-background" />
  );
}
