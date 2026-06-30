import { Field } from "@/components/ui/Field";
import { cn } from "@/utils/cn";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

interface CustomDatePickerProps {
  value: Date | string;
  label: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  availableDates?: string[];
  minDate?: string;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const CustomDatePicker = forwardRef<
  HTMLButtonElement,
  CustomDatePickerProps
>(
  (
    {
      value,
      label,
      placeholder = "Selecione uma data",
      error,
      onChange,
      onBlur,
      required = false,
      availableDates = [],
      minDate,
    },
    ref,
  ) => {
    const dateObj = value
      ? typeof value === "string"
        ? new Date(value + "T00:00:00")
        : value
      : null;
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"days" | "months" | "years">("days");
    const [alignRight, setAlignRight] = useState(false);

    const [currentDate, setCurrentDate] = useState(() => {
      if (dateObj) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
      }
      return new Date();
    });

    const dropdownRef = useRef<HTMLDivElement>(null);
    const availableSet = new Set(availableDates);

    useEffect(() => {
      if (isOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceToRight = window.innerWidth - rect.left;
        setAlignRight(spaceToRight < 260);
      }
    }, [isOpen]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [isOpen]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (y: number, m: number) =>
      new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) =>
      new Date(y, m, 1).getDay();

    const formatToYYYYMMDD = (y: number, m: number, d: number) => {
      return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    };

    const isAvailable = (y: number, m: number, d: number) => {
      const dateStr = formatToYYYYMMDD(y, m, d);

      if (minDate && dateStr < minDate) return false;
      if (availableDates.length === 0) return true;
      return availableSet.has(formatToYYYYMMDD(y, m, d));
    };

    const hasAvailableDatesInMonth = (y: number, m: number) => {
      if (availableDates.length === 0) return true;
      const prefix = `${y}-${String(m + 1).padStart(2, "0")}`;
      return availableDates.some((d) => {
        if (minDate && d < minDate) return false;
        return d.startsWith(prefix);
      });
    };

    const handleDateSelect = (d: number) => {
      const formattedDate = formatToYYYYMMDD(year, month, d);
      onChange(formattedDate);
      setIsOpen(false);
      setView("days");
    };

    const renderDays = () => {
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month);
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-7 w-7" />);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = formatToYYYYMMDD(year, month, d);
        const isSelected = dateObj
          ? formatToYYYYMMDD(
              dateObj.getFullYear(),
              dateObj.getMonth(),
              dateObj.getDate(),
            ) === dateStr
          : false;
        const isValid = isAvailable(year, month, d);

        days.push(
          <button
            key={d}
            type="button"
            disabled={!isValid}
            onClick={() => handleDateSelect(d)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all",
              isSelected
                ? "bg-[#6bc4a6] text-white font-bold shadow-sm ring-1 ring-[#6bc4a6] ring-offset-1 cursor-pointer"
                : isValid
                  ? "bg-[#e6f4ef] text-[#52b594] font-bold hover:bg-[#d9e9e3] cursor-pointer"
                  : "text-[#a0998e] cursor-not-allowed opacity-60 bg-[#faf8f5] line-through decoration-[#a0998e]/40 font-medium",
            )}
          >
            {d}
          </button>,
        );
      }
      return days;
    };

    const renderMonths = () => {
      return MONTHS.map((m, idx) => {
        const hasAvailable = hasAvailableDatesInMonth(year, idx);
        const isCurrentMonth = month === idx;

        return (
          <button
            key={m}
            type="button"
            onClick={() => {
              setCurrentDate(new Date(year, idx, 1));
              setView("days");
            }}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg p-1 text-xs font-medium transition-all h-10 cursor-pointer",
              isCurrentMonth
                ? "bg-[#e6f4ef] text-[#2d6150] font-bold ring-1 ring-[#6bc4a6]"
                : "text-[#5a5248] hover:bg-[#f5f0e8]",
            )}
          >
            {m.slice(0, 3)}
            {hasAvailable && availableDates.length > 0 && (
              <div className="mt-1 h-1 w-1 rounded-full bg-[#6bc4a6]" />
            )}
          </button>
        );
      });
    };

    const renderYears = () => {
      const startYear = Math.floor(year / 10) * 10;
      const years = [];
      for (let i = 0; i < 12; i++) {
        const currentY = startYear - 1 + i;
        const isCurrentYear = year === currentY;
        years.push(
          <button
            key={currentY}
            type="button"
            onClick={() => {
              setCurrentDate(new Date(currentY, month, 1));
              setView("months");
            }}
            className={cn(
              "flex items-center justify-center rounded-lg p-1 text-xs font-medium transition-all h-9 cursor-pointer",
              isCurrentYear
                ? "bg-[#e6f4ef] text-[#2d6150] font-bold ring-1 ring-[#6bc4a6]"
                : "text-[#5a5248] hover:bg-[#f5f0e8]",
            )}
          >
            {currentY}
          </button>,
        );
      }
      return years;
    };

    const displayValue = dateObj
      ? `${String(dateObj.getDate()).padStart(2, "0")}/${String(dateObj.getMonth() + 1).padStart(2, "0")}/${dateObj.getFullYear()}`
      : "";

    return (
      <Field label={label} error={error} required={required}>
        <div className="relative" ref={dropdownRef}>
          <button
            ref={ref}
            type="button"
            onBlur={onBlur}
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "flex w-full items-center justify-between cursor-pointer px-3.5 py-2.5 rounded-md border-[1.5px] text-sm transition-colors bg-white font-sans outline-none",
              error
                ? "border-red-400 text-red-900"
                : isOpen
                  ? "border-teal-400 text-stone-800"
                  : "border-stone-300 hover:border-stone-400 text-stone-800",
            )}
          >
            <span className={dateObj ? "text-[#3a3530]" : "text-[#a0998e]"}>
              {displayValue || placeholder}
            </span>
            <CalendarIcon size={16} className="text-[#a0998e]" />
          </button>

          {isOpen && (
            <div
              className={cn(
                "absolute bottom-[calc(100%+6px)] sm:bottom-auto sm:top-[calc(100%+4px)] z-15 w-60 rounded-xl bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-[#e8e0d5]",
                alignRight ? "right-0" : "left-0",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (view === "days")
                      setCurrentDate(new Date(year, month - 1, 1));
                    if (view === "months")
                      setCurrentDate(new Date(year - 1, month, 1));
                    if (view === "years")
                      setCurrentDate(new Date(year - 10, month, 1));
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a0998e] hover:bg-[#f5f0e8] hover:text-[#5a5248] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (view === "days") setView("months");
                    else if (view === "months") setView("years");
                  }}
                  className="rounded-lg px-2 py-1 text-xs font-bold text-[#3a3530] hover:bg-[#f5f0e8] transition-colors cursor-pointer"
                >
                  {view === "days" && `${MONTHS[month]} de ${year}`}
                  {view === "months" && `${year}`}
                  {view === "years" &&
                    `${Math.floor(year / 10) * 10} - ${Math.floor(year / 10) * 10 + 9}`}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (view === "days")
                      setCurrentDate(new Date(year, month + 1, 1));
                    if (view === "months")
                      setCurrentDate(new Date(year + 1, month, 1));
                    if (view === "years")
                      setCurrentDate(new Date(year + 10, month, 1));
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a0998e] hover:bg-[#f5f0e8] hover:text-[#5a5248] transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {view === "days" && (
                <>
                  <div className="mb-1.5 grid grid-cols-7 text-center text-[11px] font-bold text-[#a0998e]">
                    {DAYS_OF_WEEK.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                    {renderDays()}
                  </div>
                </>
              )}

              {view === "months" && (
                <div className="grid grid-cols-3 gap-1">{renderMonths()}</div>
              )}

              {view === "years" && (
                <div className="grid grid-cols-3 gap-1">{renderYears()}</div>
              )}
            </div>
          )}
        </div>
      </Field>
    );
  },
);

CustomDatePicker.displayName = "CustomDatePicker";
