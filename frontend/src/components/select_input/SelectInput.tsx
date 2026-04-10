import { Filter, ChevronDown } from "lucide-react";

interface SelectInputProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  defaultOption?: string;
  width?: string;
  icon?: React.ElementType;
}

export const SelectInput = ({
  value,
  onChange,
  options,
  defaultOption,
  width = "w-full",
  icon: Icon = Filter,
}: SelectInputProps) => (
  <div className={`relative ${width}`}>
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none">
      <Icon size={16} />
    </span>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-[26px] pr-7 py-1.5 border border-[#e2ddd5] rounded-lg bg-[#faf8f4] text-xs text-[#4a4540] outline-none box-border font-inherit cursor-pointer appearance-none transition-colors duration-200 focus:border-[#6bc4a6]"
    >
      {defaultOption && <option value={defaultOption}>{defaultOption}</option>}

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none">
      <ChevronDown size={14} />
    </span>
  </div>
);
