/* Styled link with underline and arrow superscript; set external={false} for same-tab navigation */
export default function Links({
  href,
  children,
  superscript,
  external = true,
}: {
  href: string;
  children: React.ReactNode;
  superscript: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-text-primary inline-flex items-start gap-0.5 hover:text-secondary transition-colors group p-3 -m-3"
    >
      <span className="underline underline-offset-2">{children}</span>
      <span className="text-secondary text-[14px] leading-none">{superscript}</span>
    </a>
  );
}
