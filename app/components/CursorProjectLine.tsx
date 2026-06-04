"use client";

// CursorProjectLine — not currently rendered, kept for future use.
// Implements the cursor-line project reveal effect: a horizontal line follows
// the mouse and detects which project image it crosses, showing metadata above/below.

import { useState, useRef, useEffect, type RefObject } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Project } from "@/app/projects/config/projects";

type Props = {
  projects: Project[];
  footerRef?: RefObject<HTMLDivElement | null>;
};

export default function CursorProjectLine({ projects, footerRef }: Props) {
  const router = useRouter();
  const [lineY, setLineY] = useState<number | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineYRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLElement | null>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const maxY = footerRef?.current?.getBoundingClientRect().top ?? window.innerHeight;
    setLineY(Math.min(Math.max(e.clientY, 0), maxY));
  }

  function detectProject(y: number | null) {
    if (y === null) { setActiveProject(null); return; }
    const idx = itemRefs.current.findIndex((el) => {
      if (!el) return false;
      const { top, bottom } = el.getBoundingClientRect();
      return y >= top && y <= bottom;
    });
    setActiveProject(idx >= 0 ? projects[idx] : null);
  }

  useEffect(() => {
    lineYRef.current = lineY;
    detectProject(lineY);
  }, [lineY]);

  return (
    <div className="relative flex h-full" onMouseMove={handleMouseMove}>
      <aside
        ref={scrollRef as RefObject<HTMLElement>}
        className="w-full h-full overflow-y-auto no-scrollbar"
        onScroll={() => detectProject(lineYRef.current)}
      >
        <div className="flex flex-col items-start px-[32px] pt-32 gap-[32px]">
          {projects.map((project, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="w-fit cursor-pointer"
              onClick={() => router.push("/projects")}
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

      {lineY !== null && (
        <div
          className="absolute left-0 right-0 pointer-events-none z-10"
          style={{ top: lineY }}
        >
          {activeProject && (
            <>
              <div className="absolute bottom-0 left-6 pb-2">
                <p className="text-[56px] leading-none font-google-sans-flex font-medium tracking-[-0.03em] text-text-primary p-[16px]">
                  {activeProject.name}
                </p>
              </div>
              <div className="absolute top-0 left-6 pt-2">
                <div className="flex items-center gap-12 p-[16px]">
                  {[activeProject.role, activeProject.tech, activeProject.period]
                    .filter(Boolean)
                    .map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-[20px] font-urbanist font-medium leading-[140%] tracking-[-0.015em] text-text-primary"
                      >
                        {detail}
                      </span>
                    ))}
                </div>
              </div>
            </>
          )}
          <div className="w-full h-[1px] bg-divider" />
        </div>
      )}
    </div>
  );
}
