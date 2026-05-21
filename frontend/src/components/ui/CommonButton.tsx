import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  sizeIcon?: number;
}

export default function CommonButton({
  label,
  className,
  startIcon: StartIcon,
  endIcon: EndIcon,
  sizeIcon=16,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px]",
        "text-left text-sm leading-[1.35] whitespace-pre-line",
        "hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer",
        "bg-[#6bc4a6] hover:bg-[#52b594] text-white font-bold",
        className,
      )}
    >
      {StartIcon && <StartIcon size={sizeIcon} />}
      <span>{label}</span>
      {EndIcon && <EndIcon size={sizeIcon} />}
    </button>
  );
}
