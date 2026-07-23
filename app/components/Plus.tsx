/** Small plus/corner marker icon used as a decorative element across layouts. */
export default function Plus({ size = 10 }: { size?: number }) {
  return (
    <img src="/icons/plusIcon.svg" alt="" width={size} height={size} className="select-none" />
  );
}
