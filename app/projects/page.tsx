"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import { projects, type Project } from "@/app/projects/config/projects";

export default function Projects() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const vertBarRef = useRef<HTMLDivElement>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);
  const [headingHeight, setHeadingHeight] = useState(0);
  const [detailsLeft, setDetailsLeft] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  useEffect(() => {
    if (headingRef.current) setHeadingHeight(headingRef.current.offsetHeight);
    if (mainRef.current) {
      const rect = mainRef.current.getBoundingClientRect();
      setCursorY(rect.height / 2);
    }
    if (vertBarRef.current && mainRef.current) {
      const barRect = vertBarRef.current.getBoundingClientRect();
      const mainRect = mainRef.current.getBoundingClientRect();
      setDetailsLeft(barRect.left - mainRect.left + 2);
    }
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const container = hScrollRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (listRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const mainRect = mainRef.current?.getBoundingClientRect();
      if (!mainRect) return;
      const headingBottom = headingRef.current?.getBoundingClientRect().bottom ?? 0;
      const clamped = Math.min(Math.max(e.clientY, headingBottom), mainRect.bottom - headingHeight);
      setCursorY(clamped - mainRect.top);
    };
    const onLeave = () => setCursorY(null);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [headingHeight]);

  return (
    <>
      <Sidebar />
      <main
        ref={mainRef}
        className="relative flex-1 flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/images/projects_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: visible ? 1 : 0,
          transition: "opacity 900ms cubic-bezier(0.4, 0, 0.6, 1)",
        }}
      >
        <style>{`.project-list::-webkit-scrollbar { display: none; }`}</style>

        {cursorY !== null && (
          <div
            className="pointer-events-none absolute left-0 right-0 h-px bg-yellow-400 z-10"
            style={{ top: cursorY }}
          />
        )}

        {cursorY !== null && hoveredProject && (
          <>
            <div
              className="absolute pointer-events-none z-20 -translate-y-full pb-1"
              style={{ top: cursorY, left: detailsLeft + 24, right: 260 }}
            >
              <h2 className="font-sans font-thin text-[80px] leading-none text-white uppercase tracking-wide">
                {hoveredProject.name}
              </h2>
            </div>
            <div
              className="absolute pointer-events-none z-20 flex items-center gap-3 pt-1"
              style={{ top: cursorY, left: detailsLeft + 24, right: 260 }}
            >
              <span className="font-sans text-sm text-white/80">{hoveredProject.role}</span>
              <span className="w-2 h-2 bg-yellow-400 flex-shrink-0" />
              <span className="font-sans text-sm text-white/80">{hoveredProject.tech}</span>
              <span className="w-2 h-2 bg-yellow-400 flex-shrink-0" />
              <span className="font-sans text-sm text-white/80">{hoveredProject.period}</span>
            </div>
          </>
        )}

        <div ref={hScrollRef} className="flex flex-1 overflow-x-auto no-scrollbar">
          <div
            className="grid min-w-full pr-[32px]"
            style={{ gridTemplateColumns: "max-content 1px 1fr", gridTemplateRows: "auto 1fr" }}
          >
            <div ref={headingRef} className="p-6 row-start-1 col-start-1">
              <h1 className="font-sans font-thin text-[67px] leading-[75px] text-white">
                /proof_of_work
              </h1>
            </div>
            <div ref={vertBarRef} className="bg-yellow-400 col-start-2 row-start-1 row-span-2" />

            <div className="col-start-3 row-start-1 row-span-2 relative">
              <div
                ref={listRef}
                className="project-list absolute right-0 top-0 bottom-0 w-[220px] overflow-y-auto flex flex-col gap-4 p-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
              >
                {projects.map((project, i) => (
                  <div
                    key={i}
                    data-cursor="plus"
                    className="relative w-full h-[180px] flex-shrink-0"
                    onMouseEnter={() => setHoveredProject(project)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
