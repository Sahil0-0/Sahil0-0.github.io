"use client";

import { motion, LayoutGroup } from "motion/react";
import { TABS, Tab } from "@/app/config/constants";
import AnimatedDivider from "@/app/components/AnimatedDivider";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export default function MobileTabHeader({ activeTab, onTabChange }: Props) {
  return (
    <LayoutGroup>
      <div className="shrink-0 relative flex items-stretch gap-[4px] px-[10px] py-[12px] bg-background">
        <AnimatedDivider className="absolute top-0 left-0 right-0" />
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="relative flex-1 flex items-center justify-center px-[8px] py-[8px] cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-corners-mobile"
                  className="absolute inset-0 pointer-events-none"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <span className="absolute top-0 left-0 w-[6px] h-[6px] border-t border-l border-text-primary" />
                  <span className="absolute top-0 right-0 w-[6px] h-[6px] border-t border-r border-text-primary" />
                  <span className="absolute bottom-0 left-0 w-[6px] h-[6px] border-b border-l border-text-primary" />
                  <span className="absolute bottom-0 right-0 w-[6px] h-[6px] border-b border-r border-text-primary" />
                </motion.div>
              )}
              <span
                className="text-[11px] uppercase tracking-[0.06em] font-urbanist font-medium whitespace-nowrap"
                style={{ color: isActive ? "var(--text-primary)" : "var(--text-links)" }}
              >
                {tab}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
