import { Field } from "@/components/ui/Field";
import { SelectOption } from "@/types/selectOption";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  label: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  isSetLabel?: boolean;
  required?: boolean;
}

export function CustomMultiSelect({
  options,
  value = [],
  label,
  placeholder = "Selecione as opções",
  error,
  onChange,
  onBlur,
  isSetLabel = false,
  required = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value) || value.includes(opt.label))
    .map((opt) => opt.label);

  const displayText =
    selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

  const handleToggleOption = (option: SelectOption) => {
    const targetValue = isSetLabel ? option.label : option.value;

    if (value.includes(targetValue)) {
      onChange(value.filter((item) => item !== targetValue));
    } else {
      onChange([...value, targetValue]);
    }
  };

  return (
    <Field label={label} error={error} required={required}>
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
          <span
            className={value.length > 0 ? "text-stone-800" : "text-stone-400"}
          >
            <span className="block truncate">
              {displayText}
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
              {options.map((option) => {
                const targetValue = isSetLabel ? option.label : option.value;
                const isSelected = value.includes(targetValue);

                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleToggleOption(option)}
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

              {options.length === 0 && (
                <div className="px-3.5 py-2.5 text-xs text-stone-500 text-center">
                  Nenhuma opção disponível
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}
