import { z } from "zod";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DURATION_MINUTES = 23 * 60 + 59;

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const scheduleSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
    startTime: z
      .string()
      .regex(TIME_PATTERN, "Informe um horário de início válido."),
    endTime: z
      .string()
      .regex(TIME_PATTERN, "Informe um horário de término válido."),
    durationMinutes: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasStartDate = DATE_PATTERN.test(data.startDate);
    const hasEndDate = DATE_PATTERN.test(data.endDate);

    if (!hasStartDate || !hasEndDate) {
      if (!hasStartDate) {
        ctx.addIssue({
          code: "custom",
          path: ["startDate"],
          message: "Inclua a data de início e fim.",
        });
      }

      if (!hasEndDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "Inclua a data de início e fim.",
        });
      }
    } else if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "A data final deve ser posterior à data inicial.",
      });
    }

    if (
      TIME_PATTERN.test(data.startTime) &&
      TIME_PATTERN.test(data.endTime) &&
      timeToMinutes(data.endTime) <= timeToMinutes(data.startTime)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message:
          "O horário de término deve ser posterior ao horário de início.",
      });
    }

    const duration = Number(data.durationMinutes);

    if (
      data.durationMinutes.trim() === "" ||
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["durationMinutes"],
        message: "A duração deve ser maior que zero.",
      });
    } else if (duration > MAX_DURATION_MINUTES) {
      ctx.addIssue({
        code: "custom",
        path: ["durationMinutes"],
        message: "A duração deve ser menor que 24 horas.",
      });
    }
  });

