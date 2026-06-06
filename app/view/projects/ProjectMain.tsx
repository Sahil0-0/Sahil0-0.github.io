"use client";

import Image from "next/image";
import { useRef } from "react";
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

  if (prevImageRef.current !== project.image) {
    const prevIdx = projects.findIndex((p) => p.image === prevImageRef.current);
    const currIdx = projects.findIndex((p) => p.image === project.image);
    dirRef.current = currIdx >= prevIdx ? 1 : -1;
    prevImageRef.current = project.image;
  }

  if (isArt) {
    return (
      <motion.div
        className="relative w-full h-full overflow-hidden"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
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
              className="object-cover blur-[4px] scale-110 opacity-25"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center p-[48px]">
              <div className="relative w-full h-full">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full bg-background" />
  );
}
