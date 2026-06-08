"use client";

import CommonButton from "@/components/ui/CommonButton";
import { Field } from "@/components/ui/Field";
import { Plus } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface ManualSlotData {
  date: string;
  startTime: string;
  endTime: string;
}

interface ScheduleManualSlotFormProps {
  disabled: boolean;
  minDate?: string;
  maxDate?: string;
  minTime?: string;
  maxTime?: string;
  onAddSlot: (slot: ManualSlotData) => boolean;
}

const baseInputClass =
  "w-full rounded-md border-[1.5px] border-[#e9dfc9] bg-white px-4 py-3 text-center text-sm text-stone-700 outline-none transition-colors hover:border-[#d6cbb5] focus:border-[#6bc4a6] disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400";

const initialValues: ManualSlotData = {
  date: "",
  startTime: "",
  endTime: "",
};

export default function ScheduleManualSlotForm({
  disabled,
  minDate,
  maxDate,
  minTime,
  maxTime,
  onAddSlot,
}: ScheduleManualSlotFormProps) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
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
      <Field label="Data manual:">
        <input
          type="date"
          name="date"
          value={values.date}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          onChange={handleChange}
          className={baseInputClass}
        />
      </Field>

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
