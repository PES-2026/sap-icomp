"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";

export interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  width?: string;
  icon?: React.ElementType;
  isSetLabel?: boolean;
}

export const SelectInput = ({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  width = "w-full",
  icon: Icon = Filter,
  isSetLabel = false,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<"up" | "down">("down");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const allOptions = placeholder
    ? [{ value: "", label: placeholder }, ...options]
    : options;

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

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;

      const REQUIRED_SPACE = 260;

      if (spaceBelow < REQUIRED_SPACE) {
        setOpenDirection("up");
      } else {
        setOpenDirection("down");
      }
    }
  }, [isOpen]);

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none z-10">
        <Icon size={16} />
      </span>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-left pl-8 pr-7 py-2 border rounded-lg bg-[#faf8f4] text-sm text-[#4a4540] outline-none box-border font-inherit cursor-pointer transition-colors duration-200
          ${isOpen ? "border-[#6bc4a6]" : "border-[#e2ddd5]"}`}
      >
        <span className="block truncate">{selectedLabel || placeholder}</span>
      </button>

      <span
        className={`absolute right-2 top-1/2 -translate-y-1/2 text-[#a0a0a0] pointer-events-none transition-transform duration-200 z-10 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      >
        <ChevronDown size={14} />
      </span>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 bg-white rounded-lg border-[1.5px] border-[#e2ddd5] shadow-[0_6px_24px_rgba(0,0,0,0.10)] overflow-hidden
            ${openDirection === "up" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"}
          `}
        >
          <div className="max-h-60 flex flex-col overflow-y-auto py-1">
            {allOptions.map((option) => {
              const isSelected =
                value === option.value || (!value && option.value === "");

              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    onChange(isSetLabel ? option.label : option.value);
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
                  {option.label}
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
