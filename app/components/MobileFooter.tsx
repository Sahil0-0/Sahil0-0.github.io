"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Plus from "@/app/components/Plus";
import MaskIcon from "@/app/components/MaskIcon";
import AnimatedDivider from "@/app/components/AnimatedDivider";
import { EMAIL, LINKS, WORK_ICONS, PROFILE } from "@/app/config/constants";

const arrowVariants = {
  rest: { scale: 0.6, opacity: 0 },
  hover: { scale: 1, opacity: 1 },
};

function Chevron({ up }: { up: boolean }) {
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      animate={{ rotate: up ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

/**
 * Phone-only footer. A single overlay panel sits above the grid. Collapsed it
 * shows only one mail row; expanding grows the profile section in above the mail
 * (pushing the single mail row down) and the marquee + links in below it. An
 * in-flow spacer the height of the mail row reserves space so the grid stays put
 * — the panel itself is absolute and never pushes the grid. Copy stays on the
 * email text (the label swaps to "Copied!" — no hover tooltip on touch).
 */
export default function MobileFooter() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const collapsible = { type: "spring", stiffness: 320, damping: 36 } as const;

  return (
    <div className="shrink-0 relative z-20 bg-background">
      {/* Reserves the collapsed mail-row height so the grid sits below it.
          No border here — the overlay panel's own border-b is the divider. */}
      <div className="h-[40px]" />

      <div className="absolute left-0 right-0 top-0 bg-background">
        <AnimatedDivider className="absolute bottom-0 left-0 right-0 z-10" />
        {/* Persistent toggle: fixed top-left in both states, only its direction flips. */}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse" : "Expand"}
          className="absolute right-[14px] top-[4px] z-10 flex items-center justify-center w-[18px] h-[18px] text-text-links"
        >
          <Chevron up={expanded} />
        </button>

        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0 }}
          transition={collapsible}
          className="overflow-hidden"
        >
          <div className="px-[16px] pt-[12px] pb-[10px]">
            <div className="flex items-center justify-between px-[6px]">
              <div className="flex items-center gap-[12px]">
                <Image
                  src={PROFILE.image}
                  alt={PROFILE.name}
                  width={44}
                  height={44}
                  className="rounded-full shrink-0"
                />
                <p className="font-google-sans-flex font-medium text-[20px] leading-none tracking-[-0.03em] text-text-primary whitespace-nowrap">
                  {PROFILE.name}
                </p>
              </div>
              <div className="flex flex-col items-start gap-[6px]">
                {PROFILE.roles.map((role) => (
                  <p
                    key={role}
                    className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[11px] whitespace-nowrap"
                  >
                    {role}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-[12px]">
              <Plus size={7} />
              <div className="flex items-center bg-divider/10 px-[12px] pt-[10px] pb-[10px] rounded-full">
                <p className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[11px]">
                  Available for work
                </p>
              </div>
              <Plus size={7} />
            </div>
            <AnimatedDivider className="mt-[12px] -mx-[16px]" />
          </div>
        </motion.div>

        <div className={`flex items-center h-[40px] px-[16px] ${expanded ? "justify-between" : "justify-center"}`}>
          {expanded && <Plus size={7} />}
          <button
            onClick={copyEmail}
            className="uppercase text-[12px] text-text-links font-inter font-light leading-none tracking-[0.08em] transition-colors"
          >
            {copied ? "Copied!" : EMAIL}
          </button>
          {expanded && <Plus size={7} />}
        </div>

        {/* Below the mail: marquee + links. */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0 }}
          transition={collapsible}
          className="overflow-hidden"
        >
          <div className="overflow-hidden py-[10px] w-full px-[16px]">
            <div
              className="flex whitespace-nowrap w-max text-text-links"
              style={{ animation: "marquee 20s linear infinite" }}
            >
              {[...WORK_ICONS, ...WORK_ICONS].map((src, i) => (
                <MaskIcon
                  key={i}
                  src={src}
                  className="w-[18px] h-[18px] shrink-0 mr-[20px] inline-block"
                />
              ))}
            </div>
          </div>

          <div className="uppercase flex items-center justify-between px-[16px] pt-[10px] pb-[16px]">
            <Plus size={7} />
            {LINKS.map(({ label, href, external }) => (
              <motion.a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                initial="rest"
                whileHover="hover"
                className="inline-flex items-start gap-[2px] text-[12px] tracking-[0.08em] text-text-links font-inter font-light leading-none transition-colors"
              >
                {label}
                <motion.span
                  variants={arrowVariants}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="-mt-[2px]"
                >
                  <Image src="/icons/arrowLink.svg" alt="" width={10} height={10} />
                </motion.span>
              </motion.a>
            ))}
            <Plus size={7} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
