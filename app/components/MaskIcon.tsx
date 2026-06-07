type Props = {
  src: string;
  className?: string;
};

export default function MaskIcon({ src, className }: Props) {
  return (
    <span
      className={`bg-current ${className ?? ""}`}
      style={{
        maskImage: `url('${src}')`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskImage: `url('${src}')`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
