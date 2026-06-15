"use client";

import CommonButton from "@/components/ui/CommonButton";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { Field } from "@/components/ui/Field";
import { Plus } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface ManualSlotData {
  date: string;
  startTime: string;
  endTime: string;
}

interface SchedulingManualSlotFormProps {
  disabled: boolean;
  minDate?: string;
  maxDate?: string;
  minTime?: string;
  maxTime?: string;
  onAddSlot: (slot: ManualSlotData) => boolean;
}

const baseInputClass = `w-full px-3.5 py-2.5 bg-white border-[1.5px] rounded-md text-sm outline-none transition-colors font-sans
  text-stone-800 border-stone-300 hover:border-stone-400 focus:border-teal-400 placeholder:text-stone-400 disabled:opacity-50`;

const initialValues: ManualSlotData = {
  date: "",
  startTime: "",
  endTime: "",
};

export default function SchedulingManualSlotForm({
  disabled,
  minDate,
  maxDate,
  minTime,
  maxTime,
  onAddSlot,
}: SchedulingManualSlotFormProps) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleDateChange = (dateStr: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      date: dateStr,
    }));
  };

  const handleAddClick = () => {
    const wasAdded = onAddSlot(values);

    if (wasAdded) {
      setValues(initialValues);
    }
  };

  return (
    <div
      onChange={(event) => event.stopPropagation()}
      className="mb-5 grid grid-cols-1 gap-3 border-b border-[#ece7db] pb-5 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <div className={disabled ? "pointer-events-none opacity-60" : ""}>
        <CustomDatePicker
          label="Data manual:"
          value={values.date}
          onChange={handleDateChange}
        />
      </div>

      <Field label="Início manual:">
        <input
          type="time"
          name="startTime"
          value={values.startTime}
          min={minTime}
          max={maxTime}
          disabled={disabled}
          onChange={handleChange}
          className={baseInputClass}
        />
      </Field>

      <Field label="Fim manual:">
        <input
          type="time"
          name="endTime"
          value={values.endTime}
          min={minTime}
          max={maxTime}
          disabled={disabled}
          onChange={handleChange}
          className={baseInputClass}
        />
      </Field>

      <div className="flex items-end">
        <CommonButton
          label="Adicionar"
          type="button"
          startIcon={Plus}
          disabled={disabled}
          onClick={handleAddClick}
          className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
}
