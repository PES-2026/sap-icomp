import { Field } from "@/components/ui/Field";
import { SelectOption } from "@/types/selectOption";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SelectProps {
  options: SelectOption[];
  value: string;
  label: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  isSetLabel?: boolean;
}

export function CustomSelect({
  options,
  value,
  label,
  placeholder = "Selecione uma opção",
  error,
  onChange,
  onBlur,
  isSetLabel = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(
    (opt) => opt.value === value || opt.label === value,
  )?.label;

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Field label={label} error={error}>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            flex w-full items-center justify-between cursor-pointer 
            px-3 py-2.5 rounded-md border-[1.5px] text-sm transition-colors
            ${
              error
                ? "border-red-400"
                : isOpen
                  ? "border-teal-400"
                  : "border-stone-300 hover:border-stone-400"
            }
          `}
        >
          <span className={value ? "text-stone-800" : "text-stone-400"}>
            <span className="block truncate">
              {selectedLabel || placeholder}
            </span>
          </span>
          <span
            className={`text-stone-500 transition-transform duration-150 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown size={16} />
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white rounded-lg border-[1.5px] border-stone-300 shadow-lg overflow-hidden">
            <div className="max-h-60 flex flex-col overflow-y-auto">
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
                          ? "bg-teal-50 text-teal-700 font-bold"
                          : "bg-transparent text-stone-700 font-medium hover:bg-[#f5f5f5]"
                      }
                    `}
                  >
                    {option.label}
                    {isSelected && (
                      <Check size={16} className="text-teal-700" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}
