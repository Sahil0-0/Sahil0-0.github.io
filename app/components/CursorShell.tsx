"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getLastCursorPosition,
  setLastCursorPosition,
} from "@/app/components/cursorPosition";

const DOT_ONLY_ROUTES = ["/projects"];
const CURSOR_RADIUS = 72;
const SIDEBAR_WIDTH = 68;

type Portal = { x: number; y: number; phase: "expanding" | "fading"; expanded: boolean; href: string };

/* Shared context so any component can trigger the portal navigation animation */
export const NavigationContext = createContext<{
  triggerPortal: (x: number, y: number, href: string) => void;
} | null>(null);

export function useNavigation() {
  return useContext(NavigationContext);
}

/* Full-page wrapper that tracks the mouse and renders the custom cursor overlay */
export default function CursorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dotOnly = DOT_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [isOverLink, setIsOverLink] = useState(false);
  const [isOverProject, setIsOverProject] = useState(false);
  const [portal, setPortal] = useState<Portal | null>(null);
  const portalRef = useRef<Portal | null>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    portalRef.current = portal;
  }, [portal]);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  useEffect(() => {
    if (!dotOnly || cursorRef.current) return;
    setCursor(
      getLastCursorPosition() ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    );
  }, [dotOnly]);

  const triggerPortal = (x: number, y: number, href: string) => {
    if (portalRef.current) return;
    setPortal({ x, y, phase: "expanding", expanded: false, href });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPortal(prev => prev ? { ...prev, expanded: true } : null);
      });
    });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nextCursor = { x: e.clientX, y: e.clientY };
      setLastCursorPosition(nextCursor);
      setCursor(nextCursor);
      setIsOverLink(!!(e.target as Element).closest("a, button, [data-no-cursor]"));
      setIsOverProject(!!(e.target as Element).closest("[data-cursor='plus']"));
    };
    const onLeave = () => { setCursor(null); setIsOverLink(false); setIsOverProject(false); };

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/") router.prefetch("/projects");
  }, [pathname, router]);

  useEffect(() => {
    if (pathname !== "/") return;

    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button, [data-no-cursor]")) return;
      triggerPortal(e.clientX, e.clientY, "/projects");
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat) return;
      if ((e.target as Element).closest("a, button, input, textarea, select")) return;
      const pos = cursorRef.current ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      triggerPortal(pos.x, pos.y, "/projects");
    };

    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === "clip-path") {
      router.push(portal!.href);
      setPortal(prev => prev ? { ...prev, phase: "fading" } : null);
    } else if (e.propertyName === "opacity") {
      setPortal(null);
    }
  };

  return (
    <NavigationContext.Provider value={{ triggerPortal }}>
      <div className="flex h-screen w-full overflow-hidden cursor-none">
        {cursor && (
          (dotOnly || isOverLink) ? (
            <div
              className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: cursor.x, top: cursor.y }}
            >
              <div
                className="w-3 h-3 rounded-full bg-white absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
                style={{ opacity: isOverProject ? 0 : 1 }}
              />
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-secondary flex items-center justify-center transition-opacity duration-200"
                style={{ opacity: isOverProject ? 1 : 0 }}
              >
                <span className="text-black text-[18px] leading-none select-none">+</span>
              </div>
            </div>
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

        {portal && (
          <div
            className="fixed top-0 bottom-0 right-0 z-[100] pointer-events-none"
            style={{
              left: SIDEBAR_WIDTH,
              backgroundImage: "url('/images/bg_color.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              fillOpacity: 0.25,
              clipPath: portal.expanded
                ? `circle(200vmax at ${portal.x - SIDEBAR_WIDTH}px ${portal.y}px)`
                : `circle(${CURSOR_RADIUS}px at ${portal.x - SIDEBAR_WIDTH}px ${portal.y}px)`,
              opacity: portal.phase === "fading" ? 0 : 1,
              transition: portal.phase === "expanding"
                ? "clip-path 650ms cubic-bezier(0.4, 0, 1, 1)"
                : "opacity 900ms cubic-bezier(0.4, 0, 0.6, 1)",
            }}
            onTransitionEnd={handleTransitionEnd}
          />
        )}

        {children}
      </div>
    </NavigationContext.Provider>
  );
}
