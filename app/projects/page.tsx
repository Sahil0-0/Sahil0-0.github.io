"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import {
  getLastCursorPosition,
  setLastCursorPosition,
} from "@/app/components/cursorPosition";
import { projects, type Project } from "@/app/projects/config/projects";

const FILTERS = ["All", "Mobile", "Web", "Design"];
const SPRING_OMEGA = 30;

export default function Projects() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const vertBarRef = useRef<HTMLDivElement>(null);
  const lastCursorRef = useRef<{ x: number; y: number } | null>(null);
  const targetYRef = useRef<number | null>(null);
  const springRef = useRef({ x: 0, velocity: 0 });
  const lastTimeRef = useRef(0);
  const cursorVisibleRef = useRef(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [headingHeight, setHeadingHeight] = useState(0);
  const [detailsLeft, setDetailsLeft] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const pathname = usePathname();

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

  // Spring animation — updates --cursor-y on mainRef every frame
  useEffect(() => {
    let rafId: number;
    const tick = (time: number) => {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.05)
        : 0;
      lastTimeRef.current = time;

      const target = targetYRef.current;
      if (target !== null && dt > 0) {
        const s = springRef.current;
        const r =
          s.velocity - (s.x - target) * SPRING_OMEGA * SPRING_OMEGA * dt;
        const i = 1 + SPRING_OMEGA * dt;
        s.velocity = r / (i * i);
        s.x += s.velocity * dt;
        mainRef.current?.style.setProperty("--cursor-y", `${s.x}px`);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter],
  );

  const updateCursorLine = useCallback(
    (clientX: number, clientY: number, shouldUpdateLine = true) => {
      const nextCursor = { x: clientX, y: clientY };
      lastCursorRef.current = nextCursor;
      setLastCursorPosition(nextCursor);
      const mainRect = mainRef.current?.getBoundingClientRect();
      if (!mainRect) return;

      // Cursor above or below main — freeze everything
      if (clientY < mainRect.top || clientY > mainRect.bottom) return;

      const inMainX = clientX >= mainRect.left && clientX <= mainRect.right;

      const list = listRef.current;
      const listRect = list?.getBoundingClientRect();
      const padTop = list ? parseFloat(getComputedStyle(list).paddingTop) : 0;
      const padBottom = list
        ? parseFloat(getComputedStyle(list).paddingBottom)
        : 0;
      const firstThumbTop = listRect
        ? listRect.top + padTop
        : (headingRef.current?.getBoundingClientRect().bottom ?? 0);
      const lastThumbBottom = listRect
        ? listRect.bottom - padBottom
        : mainRect.bottom - headingHeight;
      const clamped = Math.min(
        Math.max(clientY, firstThumbTop),
        lastThumbBottom,
      );

      if (shouldUpdateLine) {
        const newTargetY = clamped - mainRect.top;
        if (!cursorVisibleRef.current) {
          springRef.current.x = newTargetY;
          springRef.current.velocity = 0;
          mainRef.current?.style.setProperty("--cursor-y", `${newTargetY}px`);
          cursorVisibleRef.current = true;
          setCursorVisible(true);
        }
        targetYRef.current = newTargetY;
      }

      // Hover detection only when cursor is over main content
      if (!inMainX) return;

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
    },
    [filteredProjects, headingHeight],
  );

  const updateFromLastCursor = useCallback(
    (shouldUpdateLine = true) => {
      const mainRect = mainRef.current?.getBoundingClientRect();
      if (!mainRect) return;
      const lastCursor = lastCursorRef.current ?? getLastCursorPosition();

      updateCursorLine(
        lastCursor
          ? Math.min(Math.max(lastCursor.x, mainRect.left), mainRect.right)
          : mainRect.left + mainRect.width / 2,
        lastCursor?.y ?? mainRect.top + mainRect.height / 2,
        shouldUpdateLine,
      );
    },
    [updateCursorLine],
  );

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    let targetY = listRef.current?.scrollTop ?? 0;
    let rafId = 0;
    let scrollEndId = 0;
    const updateHoverAfterScroll = () => {
      window.clearTimeout(scrollEndId);
      scrollEndId = window.setTimeout(() => updateFromLastCursor(false), 80);
    };
    const tick = () => {
      const list = listRef.current;
      if (!list) {
        rafId = 0;
        return;
      }
      const diff = targetY - list.scrollTop;
      if (Math.abs(diff) < 0.5) {
        list.scrollTop = targetY;
        updateHoverAfterScroll();
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
      const nextCursor = { x: e.clientX, y: e.clientY };
      lastCursorRef.current = nextCursor;
      setLastCursorPosition(nextCursor);
      if (!rafId) targetY = list.scrollTop;
      targetY = Math.max(
        0,
        Math.min(targetY + e.deltaY, list.scrollHeight - list.clientHeight),
      );
      updateHoverAfterScroll();
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    main.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      main.removeEventListener("wheel", onWheel);
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(scrollEndId);
    };
  }, [updateCursorLine, updateFromLastCursor]);

  useEffect(() => {
    const setInitialCursorLine = () => {
      updateFromLastCursor();
    };

    const initialFrame = requestAnimationFrame(setInitialCursorLine);
    const onMove = (e: MouseEvent) => updateCursorLine(e.clientX, e.clientY);
    const onResize = () => setInitialCursorLine();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(initialFrame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [updateCursorLine, updateFromLastCursor]);

  return (
    <>
      <Sidebar />
      <main
        ref={mainRef}
        className="relative flex-1 flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/images/projects_bg.png')",
          backgroundColor: "var(--secondary)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: visible ? 1 : 0,
          transition: "opacity 900ms cubic-bezier(0.4, 0, 0.6, 1)",
        }}
      >
        <style>{`.project-list::-webkit-scrollbar { display: none; }`}</style>

        {cursorVisible && (
          <div
            className="pointer-events-none absolute left-0 right-0 h-px bg-yellow-400 z-10"
            style={{ top: "var(--cursor-y)" }}
          />
        )}

        {cursorVisible && (
          <div
            className="absolute z-20 flex items-end gap-8 -translate-y-full pointer-events-auto"
            style={{ top: "var(--cursor-y)", left: 12 }}
          >
            {(
              [
                ["Projects", "/projects"],
                ["Artworks", "/artworks"],
                ["Info/Contact", "/info"],
              ] as const
            ).map(([label, href]) => (
              <a
                key={label}
                href={href}
                className={`font-sans text-sm tracking-widest transition-colors duration-200 block pb-7 -mb-6 ${pathname === href ? "text-secondary" : "text-white hover:text-secondary"}`}
              >
                {label}
              </a>
            ))}
          </div>
        )}

        {cursorVisible && hoveredProject && (
          <>
            <div
              className="absolute pointer-events-none z-20 -translate-y-full pb-1"
              style={{
                top: "var(--cursor-y)",
                left: detailsLeft,
                right: 340,
              }}
            >
              <h2 className="font-label font-regular text-[50px] leading-none text-white  tracking-wide">
                {hoveredProject.name}
              </h2>
            </div>
            <div
              className="absolute pointer-events-none z-20 flex items-center gap-3 pt-1"
              style={{
                top: "var(--cursor-y)",
                left: detailsLeft + 4,
                right: 340,
              }}
            >
              <span className="font-sans text-sm text-white/80">
                {hoveredProject.role}
              </span>
              <span className="w-2 h-2 bg-yellow-400 flex-shrink-0" />
              <span className="font-sans text-sm text-white/80">
                {hoveredProject.tech}
              </span>
              <span className="w-2 h-2 bg-yellow-400 flex-shrink-0" />
              <span className="font-sans text-sm text-white/80">
                {hoveredProject.period}
              </span>
            </div>
          </>
        )}

        <div
          ref={hScrollRef}
          className="flex flex-1 overflow-x-auto no-scrollbar"
        >
          <div
            className="grid min-w-full"
            style={{
              gridTemplateColumns: "max-content 1px 1fr max-content",
              gridTemplateRows: "auto 1fr",
            }}
          >
            {/* Col 1 — heading */}
            <div ref={headingRef} className="p-6 row-start-1 col-start-1">
              <h1 className="font-sans font-thin text-[50px] leading-[75px] text-white">
                /proof_of_work
              </h1>
            </div>

            {/* Col 2 — left yellow bar */}
            <div
              ref={vertBarRef}
              className="bg-yellow-400 col-start-2 row-start-1 row-span-2"
            />

            {/* Col 3 — filter (left) + thumbnail list (right) */}
            <div className="col-start-4 row-start-1 row-span-2 flex flex-row px-2 gap-2 h-full min-h-0">
              <div className="flex flex-col items-end my-[24px] gap-2 shrink-0">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`font-mono text-sm text-right transition-colors ${
                      activeFilter === f
                        ? "text-secondary"
                        : "text-white hover:text-secondary"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div
                ref={listRef}
                className="project-list w-[220px] flex-1 overflow-y-auto flex flex-col min-h-0 py-[180px]"
                style={
                  {
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  } as React.CSSProperties
                }
              >
                {filteredProjects.map((project, i) => (
                  <div
                    key={i}
                    className={`flex-shrink-0 ${i === filteredProjects.length - 1 ? "" : "pb-2"}`}
                  >
                    <Image
                      data-cursor="plus"
                      src={project.image}
                      alt={project.name}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-[120px] w-auto drop-shadow-2xl"
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
