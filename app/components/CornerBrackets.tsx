/** L-shaped corner bracket markers used to indicate an active or selected element. */
export default function CornerBrackets() {
  return (
    <>
      <span className="absolute top-0 left-0 w-[7px] h-[7px] border-t border-l border-text-primary" />
      <span className="absolute top-0 right-0 w-[7px] h-[7px] border-t border-r border-text-primary" />
      <span className="absolute bottom-0 left-0 w-[7px] h-[7px] border-b border-l border-text-primary" />
      <span className="absolute bottom-0 right-0 w-[7px] h-[7px] border-b border-r border-text-primary" />
    </>
  );
}
