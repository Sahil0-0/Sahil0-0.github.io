"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const DOT_ONLY_ROUTES = ["/projects"];

/* Full-page wrapper that tracks the mouse and renders the custom cursor overlay */
export default function CursorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dotOnly = DOT_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [isOverLink, setIsOverLink] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setIsOverLink(!!(e.target as Element).closest("a, button, [data-no-cursor]"));
    };
    const onLeave = () => { setCursor(null); setIsOverLink(false); };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden cursor-none">
      {cursor && (
        (dotOnly || isOverLink) ? (
          <div
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
            style={{ left: cursor.x, top: cursor.y }}
          />
        ) : (
          <div
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full flex items-center justify-center"
            style={{ left: cursor.x, top: cursor.y, backdropFilter: "invert(1)" }}
          >
            <span className="type-mono-bold text-background mix-blend-difference text-[24px] tracking-[0.25em] uppercase">
              Enter
            </span>
          </div>
        )
      )}
      {children}
    </div>
  );
}
