import { SpecialNeed } from "@/types/special_need";

export interface NeedBadgeProps {
  value: SpecialNeed;
}

export const NeedBadge = ({ value }: NeedBadgeProps) => {
  const colorMap: Record<SpecialNeed, string> = {
    "TDAH TAG": "bg-[#fff3cd] text-[#856404]",
    TEA: "bg-[#d1ecf1] text-[#0c5460]",
    PCD: "bg-[#d4edda] text-[#155724]",
    "Dificuldade de aprendizado": "bg-[#f8d7da] text-[#721c24]",
    Nenhuma: "bg-[#e9ecef] text-[#495057]",
  };

  return (
    <span
      className={`inline-block rounded-md px-2 py-0.75 text-xs font-semibold whitespace-nowrap ${colorMap[value]}`}
    >
      {value}
    </span>
  );
};
