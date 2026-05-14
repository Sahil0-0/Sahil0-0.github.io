"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import { projects, type Project } from "@/app/projects/config/projects";

const FILTERS = ["All", "Mobile", "Web", "Design"];

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
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (headingRef.current) setHeadingHeight(headingRef.current.offsetHeight);

    if (vertBarRef.current && mainRef.current) {
      const barRect = vertBarRef.current.getBoundingClientRect();
      const mainRect = mainRef.current.getBoundingClientRect();
      setDetailsLeft(barRect.left - mainRect.left + 2);
    }
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    let targetY = 0;
    let rafId = 0;
    const tick = () => {
      const list = listRef.current;
      if (!list) {
        rafId = 0;
        return;
      }
      const diff = targetY - list.scrollTop;
      if (Math.abs(diff) < 0.5) {
        list.scrollTop = targetY;
        rafId = 0;
        return;
      }
      list.scrollTop += diff * 0.15;
      rafId = requestAnimationFrame(tick);
    };
    const onWheel = (e: WheelEvent) => {
      const list = listRef.current;
      if (!list) return;
      e.preventDefault();
      if (!rafId) targetY = list.scrollTop;
      targetY = Math.max(0, Math.min(targetY + e.deltaY, list.scrollHeight - list.clientHeight));
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    main.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      main.removeEventListener("wheel", onWheel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const filteredProjects = useMemo(
    () => (activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter)),
    [activeFilter]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const mainRect = mainRef.current?.getBoundingClientRect();
      if (!mainRect) return;
      const list = listRef.current;
      const listRect = list?.getBoundingClientRect();
      const padTop = list ? parseFloat(getComputedStyle(list).paddingTop) : 0;
      const padBottom = list ? parseFloat(getComputedStyle(list).paddingBottom) : 0;
      const firstThumbTop = listRect
        ? listRect.top + padTop
        : headingRef.current?.getBoundingClientRect().bottom ?? 0;
      const lastThumbBottom = listRect
        ? listRect.bottom - padBottom
        : mainRect.bottom - headingHeight;
      const clamped = Math.min(Math.max(e.clientY, firstThumbTop), lastThumbBottom);
      setCursorY(clamped - mainRect.top);

      const children = listRef.current?.children;
      let found: Project | null = null;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          const rect = children[i].getBoundingClientRect();
          if (clamped >= rect.top && clamped <= rect.bottom) {
            found = filteredProjects[i] ?? null;
            break;
          }
        }
      }
      setHoveredProject(found);
    };
    const onLeave = () => setCursorY(null);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [headingHeight, filteredProjects]);

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
              style={{ top: cursorY, left: detailsLeft + 4, right: 340 }}
            >
              <h2 className="font-label font-regular text-[50px] leading-none text-white uppercase tracking-wide">
                {hoveredProject.name}
              </h2>
            </div>
            <div
              className="absolute pointer-events-none z-20 flex items-center gap-3 pt-1"
              style={{ top: cursorY, left: detailsLeft + 4, right: 340 }}
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
            className="grid min-w-full"
            style={{
              gridTemplateColumns: "max-content 1px 1fr max-content",
              gridTemplateRows: "auto 1fr",
            }}
          >
            {/* Col 1 — heading */}
            <div ref={headingRef} className="p-6 row-start-1 col-start-1">
              <h1 className="font-sans font-thin text-[67px] leading-[75px] text-white">
                /proof_of_work
              </h1>
            </div>

            {/* Col 2 — left yellow bar */}
            <div ref={vertBarRef} className="bg-yellow-400 col-start-2 row-start-1 row-span-2" />

            {/* Col 3 — filter (left) + thumbnail list (right) */}
            <div className="col-start-4 row-start-1 row-span-2 flex flex-row px-2 gap-2 h-full min-h-0">
              <div className="flex flex-col items-end py- gap-2 shrink-0">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`font-mono text-sm text-right transition-colors ${
                      activeFilter === f ? "text-secondary" : "text-white hover:text-secondary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              
              <div
                ref={listRef}
                className="project-list w-[220px] flex-1 overflow-y-auto flex flex-col min-h-0 py-[180px]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
              >
                {filteredProjects.map((project, i) => (
                  <div
                    key={i}
                    data-cursor="plus"
                    className="relative w-full h-[120px] flex-shrink-0"
                  >
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className={`object-contain object-left drop-shadow-2xl ${
                        i === filteredProjects.length - 1 ? "" : "pb-2"
                      }`}
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
