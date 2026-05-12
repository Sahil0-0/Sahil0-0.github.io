import Links from "@/app/components/MakeLinks";

/* Bottom nav with social links and quick-action links */
export default function BottomNav() {
  return (
    <nav className="flex gap-10 items-end font-mono text-[14px] font-normal">
      <div className="flex flex-col gap-2">
        <Links href="https://github.com/Sahil0-0" superscript="↗">Github</Links>
        <Links href="https://www.linkedin.com/in/codedbysahil/" superscript="↗">LinkedIn</Links>
        <Links href="https://twitter.com/codedbysahil/" superscript="↗">Twitter</Links>
      </div>
      <div className="flex flex-col gap-2">
        <Links href="/projects" superscript="↗" external={false}>View Work</Links>
        <Links href="/resume.pdf" superscript="↗">Download Resume</Links>
      </div>
    </nav>
  );
}
