import Dot from "@/app/components/SidebarMenuDots";

/* Availability status badge with dot indicator */
export default function AvailableBadge() {
  return (
    <div className="flex items-center gap-2 border border-[var(--secondary)] rounded-full px-3 py-1.5">
      <Dot className="bg-[var(--secondary)]" />
      <span className="type-label text-[var(--secondary)]">Available for Work</span>
    </div>
  );
}
