/* Small decorative dot circle */
export default function Dot({ className = "" }: { className?: string }) {
  return <span className={`w-1.5 h-1.5 rounded-full ${className}`} />;
}
