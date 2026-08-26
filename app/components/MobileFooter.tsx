"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { PROFILE, PART_TIME_ROLES } from "@/app/config/constants";
import ScrambleCycleText from "@/app/components/ScrambleCycleText";

type Props = {
  isReturning?: boolean;
};


export default function MobleHeader({ isReturning = false }: Props) {
  const isInitialMount = useRef(true);
  useEffect(() => { isInitialMount.current = false; }, []);

  // Mirrors MainPanel's timing so the header and grid feel like one system
  // revealing together: same base delay, same easing on the way back.
  const baseDelay = isReturning ? 0.4 : isInitialMount.current ? 0.62 : 0;
  const enterDuration = isReturning ? 0.45 : 0.22;
  const enterEase = isReturning ? ([0.22, 1, 0.36, 1] as const) : "easeOut";

  const headerFadeDuration = 0.2;
  // Roles only start sliding once the header itself has finished fading in.
  const roleDelayStart = baseDelay + headerFadeDuration + 0.05;
  const roleStagger = 0.15;
  const roleDuration = 0.5;

  return (
    <motion.div
      className="sticky top-0 z-20 flex items-start gap-[14px] px-[16px] pt-[14px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: headerFadeDuration, delay: baseDelay } }}
    >
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-[14px]">
          <div className="flex flex-col leading-none">
            {PROFILE.name.split(" ").map((part) => (
              <p
                key={part}
                className="font-google-sans-flex font-medium text-[18px] leading-none tracking-[-0.03em] text-text-primary whitespace-nowrap"
              >
                {part}
              </p>
            ))}
          </div>

          <div className="w-px h-[32px] bg-divider/40 shrink-0" />

          <div className="flex flex-col gap-[4px] min-w-0">
            {PROFILE.roles.map((role, i) => (
              <motion.p
                key={role}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: roleDuration, ease: enterEase, delay: roleDelayStart + i * roleStagger },
                }}
                className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[9px] whitespace-nowrap"
              >
                {role}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  duration: roleDuration,
                  ease: enterEase,
                  delay: roleDelayStart + PROFILE.roles.length * roleStagger,
                },
              }}
              className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[9px] whitespace-nowrap"
            >
              <ScrambleCycleText words={PART_TIME_ROLES} />
            </motion.p>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: enterDuration, ease: enterEase, delay: baseDelay + 0.16 },
          }}
          className="self-start uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[9px] whitespace-nowrap bg-divider/10 px-[10px] py-[6px] rounded-full"
        >
          Available for work
        </motion.p>
      </div>

      <div className="flex-1" />

      <Image
        src={PROFILE.image}
        alt={PROFILE.name}
        width={60}
        height={60}
        priority
        className="rounded-full shrink-0"
      />
    </motion.div>
  );
}
