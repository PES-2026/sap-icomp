import { ManagedSchedulePeriod } from "../types/scheduleManagement";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

export const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getPeriodDates = (
  period: Exclude<ManagedSchedulePeriod, "CUSTOM">,
  referenceDate = new Date(),
) => {
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );

  if (period === "UPCOMING") {
    return { startDate: formatDateInput(today), endDate: "" };
  }

  if (period === "NEXT_15_DAYS") {
    const endDate = new Date(today.getTime() + 14 * DAY_IN_MILLISECONDS);
    return {
      startDate: formatDateInput(today),
      endDate: formatDateInput(endDate),
    };
  }

  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(
    today.getTime() - daysSinceMonday * DAY_IN_MILLISECONDS,
  );
  const weekEnd = new Date(weekStart.getTime() + 6 * DAY_IN_MILLISECONDS);

  return {
    startDate: formatDateInput(weekStart),
    endDate: formatDateInput(weekEnd),
  };
};

export const formatScheduleDate = (dateTime: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateTime));

export const formatScheduleTime = (dateTime: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateTime));

export const formatScheduleDateTime = (dateTime: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateTime));
