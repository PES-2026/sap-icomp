import {
  SchedulingDayPreview,
  SchedulingPreviewPayload,
  SchedulingSlot,
} from "../types/scheduling";

const padTime = (value: number) => String(value).padStart(2, "0");

export const minutesToTime = (totalMinutes: number) => {
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
): SchedulingDayPreview[] => {
  const days: SchedulingDayPreview[] = [];
  const startMinutes = payload.startHour;
  const endMinutes = payload.endHour;
  const attendanceTime = payload.attendanceTime;
  const breakTime = payload.breakTime;

  if (attendanceTime <= 0) return days;

  const currentDate = parseDate(payload.startDate);
  const finalDate = parseDate(payload.endDate);

  const weekdays = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  while (currentDate <= finalDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const slots: SchedulingSlot[] = [];

    for (
      let slotStart = startMinutes;
      slotStart + attendanceTime <= endMinutes;
      slotStart += attendanceTime + breakTime
    ) {
      const slotEnd = slotStart + attendanceTime;

      const startDateTime = `${dateStr}T${minutesToTime(slotStart)}:00.000Z`;
      const endDateTime = `${dateStr}T${minutesToTime(slotEnd)}:00.000Z`;

      slots.push({
        start: slotStart,
        end: slotEnd,
        attendanceTime,
        status: "CREATED",
        startDateTime,
        endDateTime,
      });
    }

    if (slots.length > 0) {
      days.push({
        date: currentDate.toISOString(),
        weekday: weekdays[currentDate.getUTCDay()]!,
        slots,
      });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return days;
};
