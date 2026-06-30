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

export const generateSchedulingPreview = (
  payload: SchedulingPreviewPayload,
): SchedulingDayPreview[] => {
  const days: SchedulingDayPreview[] = [];
  
  const startMinutes = payload.startHour.getUTCHours() * 60 + payload.startHour.getUTCMinutes();
  const endMinutes = payload.endHour.getUTCHours() * 60 + payload.endHour.getUTCMinutes();
  const attendanceTime = payload.attendanceTime;
  const breakTime = payload.breakTime;

  if (attendanceTime <= 0) return days;

  const currentDate = new Date(payload.startDate);
  const finalDate = new Date(payload.endDate);

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
        start: new Date(startDateTime),
        end: new Date(endDateTime),
        attendanceTime,
        status: "CREATED",
        startDateTime,
        endDateTime,
      });
    }

    if (slots.length > 0) {
      days.push({
        date: new Date(currentDate),
        weekday: weekdays[currentDate.getUTCDay()]!,
        slots,
      });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return days;
};
