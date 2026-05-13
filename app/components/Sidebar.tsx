"use client";

import Dot from "@/app/components/SidebarMenuDots";
import { useNavigation } from "@/app/components/CursorShell";

/* Left sidebar with vertical logo and animated dot cluster */
export default function Sidebar() {
  const nav = useNavigation();

  return (
    <aside data-no-cursor className="relative z-20 flex flex-col justify-between w-[68px] shrink-0 ">
      <div className="group relative flex flex-col justify-center items-center py-[40px] gap-[5px] border-b border-[var(--secondary)] overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-0 bg-secondary group-hover:h-full transition-all duration-500 ease-in-out" />
        {[0, 1, 2].map((i) => (
          <Dot key={i} className="relative z-10 bg-white group-hover:bg-background w-2 h-2 transition-colors duration-500" />
        ))}
      </div>

      <button
        onClick={(e) => nav?.triggerPortal(e.clientX, e.clientY, "/")}
        className="text-white hover:text-secondary transition-colors duration-300 font-sans font-extralight text-[40px] normal-case self-center px-[24px] bg-transparent border-none"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", lineHeight: "70%" }}
      >
        codedbysahil
      </button>
    </aside>
  );
}
