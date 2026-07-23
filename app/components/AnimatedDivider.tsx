"use client";

import { motion } from "motion/react";

/**
 * Horizontal hairline that "draws" itself in via clip-path on mount, matching the
 * desktop sidebar dividers (same 1.2s ease-out reveal). Use a positioning class
 * (e.g. absolute top-0 left-0 right-0) or leave it in flow.
 */
export default function AnimatedDivider({
  className = "",
  delay = 0.15,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`h-px bg-divider ${className}`}
      initial={{ clipPath: "inset(0 0% 0 100%)" }}
      animate={{
        clipPath: "inset(0 0% 0 0%)",
        transition: { duration: 1.2, ease: "easeOut", delay },
      }}
    />
  );
}
