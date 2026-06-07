"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, Project } from "@/app/config/projects";

type Props = { project: Project };

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function ProjectMain({ project }: Props) {
  const isArt = project.tags.includes("art");
  const prevImageRef = useRef<string>(project.image);
  const dirRef = useRef(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (prevImageRef.current !== project.image) {
    const prevIdx = projects.findIndex((p) => p.image === prevImageRef.current);
    const currIdx = projects.findIndex((p) => p.image === project.image);
    dirRef.current = currIdx >= prevIdx ? 1 : -1;
    prevImageRef.current = project.image;
  }

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [project.image]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom(prev => {
      const next = Math.min(5, Math.max(1, prev * (1 - e.deltaY * 0.01)));
      if (next <= 1.01) {
        setOffset({ x: 0, y: 0 });
        return 1;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isArt) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, isArt]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  if (isArt) {
    return (
      <motion.div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden select-none"
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        <AnimatePresence custom={dirRef.current}>
          <motion.div
            key={project.image}
            custom={dirRef.current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="absolute inset-0"
          >
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover blur-[4px] scale-110 opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-black/75" />
            <div className="absolute inset-0 flex items-center justify-center p-[48px]">
              <div
                className="relative w-full h-full"
                style={{
                  transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.06s ease-out",
                }}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {zoom > 1.01 && (
          <div className="absolute bottom-4 right-4 font-urbanist text-[12px] text-text-primary bg-background px-[8px] py-[4px] rounded-[8px] pointer-events-none">
            Double-click to reset
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full bg-background" />
  );
}
