import { z } from "zod";
import { isLexicalEmpty } from "../utils/lexicalState";

const requiredReportContent = (message: string) =>
  z.string().refine((value) => !isLexicalEmpty(value), message);

export const reportSchema = z.object({
  condition: requiredReportContent("A condição do estudante é obrigatória"),
  potential: requiredReportContent("As potencialidades são obrigatórias"),
  difficulties: requiredReportContent("As dificuldades são obrigatórias"),
  recommendation: requiredReportContent(
    "As recomendações metodológicas são obrigatórias",
  ),
  conclusion: requiredReportContent(
    "As considerações finais são obrigatórias",
  ),
});

export type ReportSchemaData = z.infer<typeof reportSchema>;
