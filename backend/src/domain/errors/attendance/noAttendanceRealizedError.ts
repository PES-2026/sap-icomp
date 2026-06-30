import { DomainError, ErrorCategory } from "../domainError";

export class NoAttendanceRealizedError extends DomainError {
  public readonly name: string = "NoAttendanceRealizedError";

  constructor() {
    super(
      "Não é possível gerar um relatório consolidado para alunos sem histórico de atendimentos realizados.",
      ErrorCategory.BUSINESS_RULE,
    );
  }
}
