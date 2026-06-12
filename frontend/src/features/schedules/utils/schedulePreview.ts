import {
  SchedulePreviewPayload,
  ScheduleSlot,
} from "../types/schedule";
import { timeToMinutes } from "./validations";

const padTime = (value: number) => String(value).padStart(2, "0");

const minutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${padTime(hours)}:${padTime(minutes)}`;
};

const parseDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const generateSchedulePreview = (
  payload: SchedulePreviewPayload,
): ScheduleSlot[] => {
  const slots: ScheduleSlot[] = [];
  const startMinutes = timeToMinutes(payload.startTime);
  const endMinutes = timeToMinutes(payload.endTime);
  const durationMinutes = timeToMinutes(payload.attendanceDuration);

  if (durationMinutes <= 0) return slots;

  const currentDate = parseDate(payload.startDate);
  const finalDate = parseDate(payload.endDate);

  while (currentDate <= finalDate) {
    const date = currentDate.toISOString().slice(0, 10);

    for (
      let slotStart = startMinutes;
      slotStart + durationMinutes <= endMinutes;
      slotStart += durationMinutes
    ) {
      const slotEnd = slotStart + durationMinutes;

      slots.push({
        startDateTime: `${date}T${minutesToTime(slotStart)}:00`,
        endDateTime: `${date}T${minutesToTime(slotEnd)}:00`,
      });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return slots;
};
