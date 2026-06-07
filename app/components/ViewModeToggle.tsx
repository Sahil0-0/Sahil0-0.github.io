"use client";

import MaskIcon from "@/app/components/MaskIcon";

type Props = {
  viewMode: "draw" | "code" | null;
  onViewModeChange: (mode: "draw" | "code" | null) => void;
  variant?: "nav" | "strip";
};

export default function ViewModeToggle({ viewMode, onViewModeChange, variant = "nav" }: Props) {
  const isStrip = variant === "strip";

  return (
    <div className={`flex items-center rounded-full p-[3px] gap-[2px] ${isStrip ? "bg-background shadow-md" : "bg-divider/15"}`}>
      {(["code", "draw"] as const).map((mode) => {
        const isActive = viewMode === mode;
        const iconName = mode === "draw" ? "design" : mode;
        return (
          <button
            key={mode}
            onClick={() => onViewModeChange(viewMode === mode ? null : mode)}
            className={`flex items-center justify-center rounded-full transition-all cursor-pointer ${
              isStrip ? "w-[30px] h-[30px]" : "py-[8px] px-[10px]"
            } ${isActive ? "bg-background text-text-primary" : "text-text-links hover:text-text-primary"}`}
          >
            <MaskIcon src={`/icons/${iconName}Icon.svg`} className="w-[16px] h-[16px] transition-colors" />
          </button>
        );
      })}
    </div>
  );
}
