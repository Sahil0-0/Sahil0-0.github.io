"use client";

import { motion, LayoutGroup } from "motion/react";
import { TABS, Tab, TAB_COUNTS, TAB_LABELS } from "@/app/config/constants";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showNames: boolean;
  onShowNamesChange: (v: boolean) => void;
};

export default function NavTabs({ activeTab, onTabChange, showNames, onShowNamesChange }: Props) {
  return (
    <>
      <LayoutGroup>
        <div className="flex flex-col px-[5px] py-[12px]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className="relative w-full flex items-center justify-between px-[12px] py-[12px] cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-corners"
                    className="absolute inset-0 pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <span className="absolute top-[5px] left-0 w-[7px] h-[7px] border-t border-l border-text-primary" />
                    <span className="absolute top-[5px] right-0 w-[7px] h-[7px] border-t border-r border-text-primary" />
                    <span className="absolute bottom-[5px] left-0 w-[7px] h-[7px] border-b border-l border-text-primary" />
                    <span className="absolute bottom-[5px] right-0 w-[7px] h-[7px] border-b border-r border-text-primary" />
                  </motion.div>
                )}
                <span
                  className="text-[14px] uppercase tracking-[0.08em] font-urbanist font-medium py-[4px]"
                  style={{ color: isActive ? "var(--text-primary)" : "var(--text-links)" }}
                >
                  {TAB_LABELS[tab]}
                </span>
                <span
                  className="font-inter text-[14px] leading-none"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-links)",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.04em",
                    fontWeight: 300,
                  }}
                >
                  {String(TAB_COUNTS[tab]).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="flex items-center justify-end">
        <button
          onClick={() => onShowNamesChange(!showNames)}
          className={`py-[8px] px-[10px] rounded-full bg-divider/15 flex items-center justify-center font-urbanist font-medium text-[14px] tracking-[0.02em] transition-colors cursor-pointer ${showNames ? "text-text-primary" : "text-text-links hover:text-text-primary"}`}
        >
          Aa
        </button>
      </div>
    </>
  );
}
