"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Plus from "@/app/components/Plus";
import { Tab } from "@/app/view/MainPanel";
import NavTabs from "@/app/components/NavTabs";

const arrowVariants = {
  rest: { scale: 0.6, opacity: 0 },
  hover: { scale: 1, opacity: 1 },
};

const WORK_ICONS = [
  "/icons/work/Frame.svg",
  "/icons/work/Frame-1.svg",
  "/icons/work/Frame-2.svg",
  "/icons/work/Frame-3.svg",
  "/icons/work/Frame-4.svg",
  "/icons/work/Frame-5.svg",
  "/icons/work/Frame-6.svg",
  "/icons/work/Frame-7.svg",
  "/icons/work/Frame-8.svg",
  "/icons/work/Frame-9.svg",
  "/icons/work/Frame-10.svg",
  "/icons/work/Frame-11.svg",
];

type GifType = "static" | "run" | "walk";
type GifEntry = { src: string; type: GifType };

const EMAIL = "codedbysahil@gmail.com";

type Props = {
  isReturning?: boolean;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showNames: boolean;
  onShowNamesChange: (v: boolean) => void;
  viewMode: "draw" | "code" | null;
  onViewModeChange: (mode: "draw" | "code" | null) => void;
};

export default function LeftPanel({ isReturning = false, activeTab, onTabChange, showNames, onShowNamesChange, viewMode, onViewModeChange }: Props) {
  const [gif, setGif] = useState<GifEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [panelWidth, setPanelWidth] = useState(0);
  const gifContainerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/gifs/config.json")
      .then((r) => r.json())
      .then((gifs: GifEntry[]) => {
        setGif(gifs[Math.floor(Math.random() * gifs.length)]);
      });
    setMounted(true);
    if (panelRef.current) {
      setPanelWidth(panelRef.current.offsetWidth);
    }
  }, []);
  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <aside ref={panelRef} className="w-full shrink-0 flex flex-col h-full relative">
      <motion.div
        className="absolute top-0 right-0 w-px h-full bg-divider"
        initial={
          !isReturning
            ? { clipPath: "inset(100% 0 0 0)" }
            : { clipPath: "inset(0% 0 0 0)" }
        }
        animate={{
          clipPath: "inset(0% 0 0 0)",
          transition: { duration: 1.2, ease: "easeOut", delay: 0.1 },
        }}
        exit={{
          clipPath: "inset(100% 0 0 0)",
          transition: { duration: 0.28, ease: "easeIn" },
        }}
      />
      <motion.div
        className="flex-1 min-h-0 flex flex-col p-[24px] relative"
        initial={!isReturning ? { opacity: 0, x: -18 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.22,
          type: "spring",
          stiffness: 280,
          damping: 28,
        }}
        exit={{
          opacity: 0,
          x: -12,
          transition: { duration: 0.18, ease: "easeIn" },
        }}
      >
        <div className=" flex justify-between mb-[12px]">
          <Plus />
          <Plus />
        </div>
        <div className=" flex items-center justify-center flex-row gap-[24px] px-[24px]">
          <Image
            src="/images/profileImage.png"
            alt="Sahil Singh"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="flex flex-col items-start min-w-0">
            <p className="font-google-sans-flex font-medium text-[clamp(18px,2.2vw,32px)] leading-none tracking-[-0.03em] text-text-primary">
              Sahil Singh
            </p>
            <p className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[clamp(8px,0.9vw,12px)] mt-[24px]">
              Developer
            </p>
            <p className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[clamp(8px,0.9vw,12px)] mt-[12px]">
              Design Engineer
            </p>
          </div>
        </div>
        <div className="flex justify-between my-[12px]">
          <Plus />
          <Plus />
        </div>
        <NavTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          showNames={showNames}
          onShowNamesChange={onShowNamesChange}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
        <div className="flex justify-between mt-[24px]">
          <Plus />
          <Plus />
        </div>
      </motion.div>
      {mounted && gif && (
        <div ref={gifContainerRef} className={`overflow-hidden w-full h-[120px] shrink-0${gif.type === "static" ? " flex items-end justify-end" : " flex items-end"}`}>
          {gif.type === "static" ? (
            <img src={gif.src} alt="random gif" className="max-h-full w-auto object-contain" />
          ) : (
            <motion.div
              className="inline-block h-full"
              animate={{ x: [-500, panelWidth + 500] }}
              transition={{ duration: gif.type === "run" ? 10 : 15, repeat: Infinity, ease: "linear", repeatDelay: 10 }}
            >
              <img src={gif.src} alt="random gif" className="max-h-full w-auto object-contain" />
            </motion.div>
          )}
        </div>
      )}

      <motion.div
        className="w-full h-px bg-divider"
        initial={
          !isReturning
            ? { clipPath: "inset(0 0% 0 100%)" }
            : { clipPath: "inset(0 0% 0 0%)" }
        }
        animate={{
          clipPath: "inset(0 0% 0 0%)",
          transition: { duration: 1.2, ease: "easeOut", delay: 0.15 },
        }}
        exit={{
          clipPath: "inset(0 0% 0 100%)",
          transition: { duration: 0.28, ease: "easeIn" },
        }}
      />

      <motion.div
        className="shrink-0 py-[24px]"
        initial={!isReturning ? { opacity: 0, y: 14 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.42,
          type: "spring",
          stiffness: 280,
          damping: 28,
        }}
        exit={{
          opacity: 0,
          y: 8,
          transition: { duration: 0.18, ease: "easeIn" },
        }}
      >
        <div className="flex items-center justify-between px-[24px] pb-[24px]">
          <Plus />
          <button
            onClick={copyEmail}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
            className="uppercase text-[12px] text-text-links font-inter font-light leading-none tracking-[0.08em] cursor-none hover:text-text-primary transition-colors"
          >
             codedbysahil@gmail.com
          </button>
          <Plus />
        </div>

        <div className="overflow-hidden py-[18px] w-full px-[24px]">
          <div
            className="flex whitespace-nowrap w-max text-text-links"
            style={{ animation: "marquee 20s linear infinite" }}
          >
            {[...WORK_ICONS, ...WORK_ICONS].map((src, i) => (
              <span
                key={i}
                className="w-[24px] h-[24px] shrink-0 mr-[32px] inline-block bg-current"
                style={{
                  maskImage: `url('${src}')`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskImage: `url('${src}')`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                }}
              />
            ))}
          </div>
        </div>

        <div className="uppercase flex items-center justify-between px-[24px] pt-[18px]">
          <Plus />
          <motion.a
            href="https://www.linkedin.com/in/codedbysahil"
            target="_blank"
            rel="noopener noreferrer"
            initial="rest"
            whileHover="hover"
            className="inline-flex items-start gap-[2px] text-[12px] tracking-[0.08em] text-text-links hover:text-text-primary font-inter font-light leading-none cursor-pointer transition-colors"
          >
            LinkedIn
            <motion.span
              variants={arrowVariants}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="-mt-[2px]"
            >
              <Image src="/icons/arrowLink.svg" alt="" width={10} height={10} />
            </motion.span>
          </motion.a>

          <motion.a
            href="https://github.com/Sahil0-0"
            target="_blank"
            rel="noopener noreferrer"
            initial="rest"
            whileHover="hover"
            className="inline-flex items-start gap-[2px] text-[12px] tracking-[0.08em] text-text-links hover:text-text-primary font-inter font-light leading-none cursor-pointer transition-colors"
          >
            GitHub
            <motion.span
              variants={arrowVariants}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="-mt-[2px]"
            >
              <Image src="/icons/arrowLink.svg" alt="" width={10} height={10} />
            </motion.span>
          </motion.a>

          <motion.a
            href="/resume.pdf"
            initial="rest"
            whileHover="hover"
            className="inline-flex items-start gap-[2px] text-[12px] text-text-links hover:text-text-primary font-inter font-light leading-none tracking-[0.08em] cursor-pointer transition-colors"
          >
            Resume
            <motion.span
              variants={arrowVariants}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="-mt-[2px]"
            >
              <Image src="/icons/arrowLink.svg" alt="" width={10} height={10} />
            </motion.span>
          </motion.a>

          <Plus />
        </div>
      </motion.div>

      {hover && (
        <div
          className="fixed pointer-events-none z-50 px-[10px] py-[6px] bg-black text-white text-[11px] font-inter font-medium uppercase tracking-[0.08em] leading-none rounded-sm"
          style={{ left: mouse.x + 14, top: mouse.y - 10 }}
        >
          {copied ? "Copied!" : "Copy"}
        </div>
      )}
    </aside>
  );
}
