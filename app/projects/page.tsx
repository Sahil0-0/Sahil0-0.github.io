"use client";

import { useRef, useState } from "react";
import Sidebar from "@/app/components/Sidebar";

export default function Projects() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const mainRect = mainRef.current?.getBoundingClientRect();
    const headingBottom = headingRef.current?.getBoundingClientRect().bottom ?? 0;
    if (mainRect && e.clientY > headingBottom) {
      setCursorY(e.clientY - mainRect.top);
    } else {
      setCursorY(null);
    }
  };

  return (
    <>
      <Sidebar />
      <main
        ref={mainRef}
        className="relative flex-1 flex flex-col bg-background overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursorY(null)}
      >
        {cursorY !== null && (
          <div
            className="pointer-events-none absolute left-0 right-0 h-px bg-yellow-400"
            style={{ top: cursorY }}
          />
        )}

        <div
          className="grid flex-1"
          style={{ gridTemplateColumns: "max-content 1px 1fr", gridTemplateRows: "auto 1fr" }}
        >
          <div ref={headingRef} className="p-6 row-start-1 col-start-1">
            <h1 className="font-sans font-thin text-[67px] leading-[75px] text-white">
              /proof_of_work
            </h1>
          </div>
          <div className="bg-yellow-400 col-start-2 row-start-1 row-span-2" />
          <div className="col-start-3 row-start-1" />
          <div className="col-start-1 row-start-2" />
          <div className="col-start-3 row-start-2" />
        </div>
      </main>
    </>
  );
}
