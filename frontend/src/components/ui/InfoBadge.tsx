"use client";

import { Info } from "lucide-react";

interface InfoBadgeProps {
  label: string;
  onClick: () => void;
}

export function InfoBadge({ label, onClick }: InfoBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-[#d0e0e8] bg-[#e6f0f5] px-4 py-1.5 text-sm font-medium text-[#4a545c] transition-all hover:bg-[#d4e6f0] cursor-pointer hover:scale-[1.03] duration-300"
    >
      {label}
      <Info size={14} className="text-[#6a7a85]" />
    </button>
  );
}
