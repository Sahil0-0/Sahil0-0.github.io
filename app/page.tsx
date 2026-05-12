import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import AvailableBadge from "@/app/components/AvailableBadge";
import BottomNav from "@/app/components/BottomLeftNav";

export default function Home() {
  return (
    <>
      <Sidebar />
      <main className="relative flex-1 flex flex-col overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/bg_color.jpeg"
            alt=""
            fill
            className="object-cover opacity-25"
            priority
          />
        </div>

        <div className="relative z-10 w-fit self-end flex flex-col items-end gap-3 p-6">
          <AvailableBadge />
        </div>

        <div className="flex-1" />

        <div className="relative z-10 flex justify-between items-end p-6">
          <BottomNav />
          <div className="flex flex-col items-end gap-1">
            <a
              href="mailto:codedbysahil@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[14px] font-normal hover:text-secondary transition-colors p-3 -m-3"
            >
              codedbysahil@gmail.com
            </a>
            <span className="type-label text-white">Software Development Engineer / UX Developer</span>
            <span className="type-label text-white">bangalore, India</span>
          </div>
        </div>
      </main>
    </>
  );
}
