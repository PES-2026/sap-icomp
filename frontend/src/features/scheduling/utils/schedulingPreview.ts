import { SchedulingPreviewPayload, SchedulingSlot } from "../types/scheduling";
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

export const generateSchedulingPreview = (
  payload: SchedulingPreviewPayload,
  pedagogueId: string = "preview-pedagogue-id", // Adicionado para satisfazer a interface
): SchedulingSlot[] => {
  const slots: SchedulingSlot[] = [];
  const startMinutes = timeToMinutes(payload.startTime);
  const endMinutes = timeToMinutes(payload.endTime);
  const durationMinutes = timeToMinutes(payload.attendanceDuration);

  if (durationMinutes <= 0) return slots;

  const currentDate = parseDate(payload.startDate);
  const finalDate = parseDate(payload.endDate);

  while (currentDate <= finalDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const weekday = "Monday";

    for (
      let slotStart = startMinutes;
      slotStart + durationMinutes <= endMinutes;
      slotStart += durationMinutes
    ) {
      const slotEnd = slotStart + durationMinutes;

      const startDateTime = `${dateStr}T${minutesToTime(slotStart)}:00.000Z`;
      const endDateTime = `${dateStr}T${minutesToTime(slotEnd)}:00.000Z`;

      slots.push({
        id: `preview-${dateStr}-${slotStart}`,
        pedagogueId,
        startDateTime,
        endDateTime,
        status: "CREATED",
        date: new Date(startDateTime),
        weekday,
        attendanceTime: durationMinutes,
      });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return slots;
};
