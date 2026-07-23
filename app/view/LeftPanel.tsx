"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Plus from "@/app/components/Plus";
import { Tab, EMAIL, LINKS, WORK_ICONS } from "@/app/config/constants";
import NavTabs from "@/app/components/NavTabs";
import MaskIcon from "@/app/components/MaskIcon";

const arrowVariants = {
  rest: { scale: 0.6, opacity: 0 },
  hover: { scale: 1, opacity: 1 },
};

function ScrambleText({
  text,
  className,
}: {
  text: string;
  delayMs?: number;
  durationMs?: number;
  className?: string;
}) {
  return <span className={className}>{text}</span>;
}

type GifType = "static" | "run" | "walk";
type GifEntry = { src: string; type: GifType };

type Props = {
  isReturning?: boolean;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showNames: boolean;
  onShowNamesChange: (v: boolean) => void;
  viewMode: "draw" | "code" | null;
  onViewModeChange: (mode: "draw" | "code" | null) => void;
};

export default function LeftPanel({
  isReturning = false,
  activeTab,
  onTabChange,
  showNames,
  onShowNamesChange,
  viewMode,
  onViewModeChange,
}: Props) {
  const [allGifs, setAllGifs] = useState<GifEntry[]>([]);
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
        setAllGifs(gifs);
        setGif(gifs[Math.floor(Math.random() * gifs.length)]);
      });
    setMounted(true);
    if (panelRef.current) {
      setPanelWidth(panelRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (!gif || allGifs.length === 0) return;
    if (gif.type !== "run" && gif.type !== "walk") return;

    const duration = gif.type === "run" ? 10 : 15;
    const repeatDelay = 3;
    const timer = setTimeout(() => {
      const movingGifs = allGifs.filter((g) => g.type === "run" || g.type === "walk");
      setGif(movingGifs[Math.floor(Math.random() * movingGifs.length)]);
    }, (duration + repeatDelay) * 1000);

    return () => clearTimeout(timer);
  }, [gif, allGifs]);

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <aside
      ref={panelRef}
      className="w-full shrink-0 flex flex-col h-full relative"
    >
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
        <div className="flex justify-between mb-[12px]">
          <Plus />
          <Plus />
        </div>
        <div className="flex items-center justify-center flex-row gap-[24px] px-[24px] max-lg:px-0">
          <Image
            src="/images/profileImage.png"
            alt="Sahil Singh"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="flex flex-col items-start min-w-0">
            <p className="font-google-sans-flex font-medium text-[clamp(18px,2.2vw,32px)] leading-none tracking-[-0.03em] text-text-primary">
              <ScrambleText
                text="Sahil Singh"
                delayMs={300}
                durationMs={1100}
              />
            </p>
            <p className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[clamp(8px,0.9vw,12px)] mt-[24px]">
              <ScrambleText text="Developer" delayMs={600} durationMs={800} />
            </p>
            <p className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[clamp(8px,0.9vw,12px)] mt-[12px]">
              <ScrambleText
                text="Design Engineer"
                delayMs={850}
                durationMs={800}
              />
            </p>
          </div>
        </div>
        <div className="flex justify-between my-[18px]">
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
          <div className="flex items-center bg-divider/10 px-[16px] py-[10px] rounded-full">
            <p className="uppercase text-text-links font-inter font-medium leading-none tracking-[0.08em] text-[clamp(8px,0.9vw,12px)]">
              Available for work
            </p>
          </div>
          <Plus />
        </div>
      </motion.div>
      {mounted && gif && (
        <div
          ref={gifContainerRef}
          className={`overflow-hidden w-full h-[100px] shrink-0${gif.type === "static" ? " flex items-end justify-end" : " flex items-end"}`}
        >
          {gif.type === "static" ? (
            <img
              src={gif.src}
              alt="random gif"
              className="max-h-full w-auto object-contain"
            />
          ) : (
            <motion.div
              key={gif.src}
              className="inline-block h-full"
              animate={{ x: [-250, panelWidth + 250] }}
              transition={{
                duration: gif.type === "run" ? 10 : 15,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3,
              }}
            >
              <img
                src={gif.src}
                alt="random gif"
                className="max-h-full w-auto object-contain"
              />
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
        <div className="lp-edge-row flex items-center justify-between px-[24px] pb-[24px]">
          <Plus />
          <button
            onClick={copyEmail}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
            className="uppercase text-[12px] text-text-links font-inter font-light leading-none tracking-[0.08em] cursor-none max-lg:cursor-pointer max-lg:break-all hover:text-text-primary transition-colors"
          >
            {EMAIL}
          </button>
          <Plus />
        </div>

        <div className="overflow-hidden py-[18px] w-full px-[24px]">
          <div
            className="flex whitespace-nowrap w-max text-text-links"
            style={{ animation: "marquee 20s linear infinite" }}
          >
            {[...WORK_ICONS, ...WORK_ICONS].map((src, i) => (
              <MaskIcon
                key={i}
                src={src}
                className="w-[24px] h-[24px] shrink-0 mr-[32px] inline-block"
              />
            ))}
          </div>
        </div>

        <div className="lp-edge-row uppercase flex items-center justify-between px-[24px] pt-[18px]">
          <Plus />
          {LINKS.map(({ label, href, external }) => (
            <motion.a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              initial="rest"
              whileHover="hover"
              className="inline-flex items-start gap-[2px] text-[12px] tracking-[0.08em] text-text-links hover:text-text-primary font-inter font-light leading-none cursor-pointer transition-colors"
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
