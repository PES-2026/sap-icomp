import { DomainError, ErrorCategory } from "../domainError";

export class NoAttendanceRealizedError extends DomainError {
  constructor() {
    super(
      "Não é possível gerar um relatório consolidado para alunos sem histórico de atendimentos realizados.",
      ErrorCategory.BUSINESS_RULE,
    );
    this.name = "NoAttendanceRealizedError";
  }
}
