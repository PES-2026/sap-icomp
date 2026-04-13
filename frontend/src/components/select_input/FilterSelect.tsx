"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

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
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allOptions = defaultOption ? [defaultOption, ...options] : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none z-10">
        <Icon size={16} />
      </span>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-left pl-6.5 pr-7 py-1.5 border rounded-lg bg-[#faf8f4] text-sm text-[#4a4540] outline-none box-border font-inherit cursor-pointer transition-colors duration-200
          ${isOpen ? "border-[#6bc4a6]" : "border-[#e2ddd5]"}`}
      >
        <span className="block truncate">
          {value || defaultOption || "Selecione"}
        </span>
      </button>

      <span
        className={`absolute right-2 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none transition-transform duration-200 z-10 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      >
        <ChevronDown size={14} />
      </span>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white rounded-lg border-[1.5px] border-[#e2ddd5] shadow-[0_6px_24px_rgba(0,0,0,0.10)] overflow-hidden">
          <div className="max-h-60 flex flex-col overflow-y-auto py-1">
            {allOptions.map((option) => {
              const isSelected =
                value === option || (!value && option === defaultOption);

              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`
                    flex w-full items-center justify-between text-left px-3.5 py-2.5 
                    text-xs font-sans transition-colors cursor-pointer border-none
                    ${
                      isSelected
                        ? "bg-[#e8f7f2] text-[#3a7060] font-bold"
                        : "bg-transparent text-[#4a4540] font-medium hover:bg-[#f5f5f5]"
                    }
                  `}
                >
                  {option}
                  {isSelected && <Check size={16} className="text-[#3a7060]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
