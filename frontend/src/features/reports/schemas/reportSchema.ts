import { z } from "zod";

const requiredReportText = (message: string) =>
  z.string().trim().min(1, message);

export const reportSchema = z.object({
  technicalOpinion: requiredReportText("O parecer técnico é obrigatório"),
  strategicInterventions: requiredReportText(
    "As intervenções estratégicas são obrigatórias",
  ),
  teacherGuidance: requiredReportText(
    "As orientações aos docentes são obrigatórias",
  ),
});

export type ReportSchemaData = z.infer<typeof reportSchema>;
