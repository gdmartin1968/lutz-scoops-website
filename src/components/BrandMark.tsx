type BrandMarkProps = {
  light?: boolean;
};

export function BrandMark({ light = false }: BrandMarkProps) {
  return (
    <div className="leading-none">
      <div
        className={`text-[1.65rem] font-black tracking-[-0.075em] ${
          light ? "text-white" : "text-[#102a54]"
        }`}
      >
        <span className="text-[#df336d]">LUTZ</span>
        <span
          className={`ml-2 font-serif italic tracking-[-0.04em] ${
            light ? "text-[#8fd8f4]" : "text-[#0873ae]"
          }`}
        >
          Scoops
        </span>
      </div>

      <div
        className={`mt-1 text-[0.58rem] font-black uppercase tracking-[0.3em] ${
          light ? "text-white/60" : "text-[#102a54]/45"
        }`}
      >
        Ice Cream · Coffee · More
      </div>
    </div>
  );
}
