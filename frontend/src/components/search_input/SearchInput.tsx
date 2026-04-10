import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  width?: string;
}

export const SearchInput = ({
  placeholder = "Buscar",
  value,
  onChange,
  width = "w-full",
}: SearchInputProps) => (
  <div className={`relative ${width}`}>
    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none">
      <Search size={16} />
    </span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-[26px] pr-2 py-1.5 border border-[#e2ddd5] rounded-lg bg-[#faf8f4] text-xs text-[#4a4540] outline-none box-border font-inherit transition-colors duration-200 focus:border-[#6bc4a6]"
    />
  </div>
);
