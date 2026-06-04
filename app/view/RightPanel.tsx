"use client";

import { useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import { projects, Project } from "@/app/config/projects";
import { Tab } from "@/app/view/MainPanel";

const TAB_TAG: Record<Tab, string> = {
  WORK: "work",
  PLAYGROUND: "projects",
  "ARTIST MIND": "art",
};

type Props = {
  activeTab: Tab;
  lineY: number | null;
  onProjectHover: (project: Project | null) => void;
  scrollRef?: RefObject<HTMLElement | null>;
};

export default function RightPanel({
  activeTab,
  lineY,
  onProjectHover,
  scrollRef,
}: Props) {
  const filtered = projects.filter((p) => p.tags.includes(TAB_TAG[activeTab]));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineYRef = useRef<number | null>(lineY);

  function detectProject() {
    const y = lineYRef.current;
    if (y === null) {
      onProjectHover(null);
      return;
    }
    const idx = itemRefs.current.findIndex((el) => {
      if (!el) return false;
      const { top, bottom } = el.getBoundingClientRect();
      return y >= top && y <= bottom;
    });
    onProjectHover(idx >= 0 ? filtered[idx] : null);
  }

  useEffect(() => {
    lineYRef.current = lineY;
    detectProject();
  }, [lineY, activeTab]);

  return (
    <aside
      ref={scrollRef}
      className="w-1/4 shrink-0 h-full overflow-y-auto no-scrollbar"
      style={{ paddingBottom: "var(--left-panel-footer-height)" }}
      onScroll={detectProject}
    >
      <div className="flex flex-col items-start px-[32px] pt-32 gap-[32px]">
        {filtered.map((project, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="w-fit"
          >
            <Image
              src={project.image}
              alt={project.name}
              width={0}
              height={0}
              sizes="100vw"
              style={{ height: "auto", width: "fit-content" }}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
