export interface PasswordResetData {
  token: string;
  expiresAt: Date;
  professorId?: string | undefined;
  pedagogueId?: string | undefined;
}

export interface PasswordResetItem extends PasswordResetData {
  internalId: number;
  createdAt: Date;
  usedAt: Date | null;
}

export interface IPasswordResetRepository {
  create(data: PasswordResetData): Promise<void>;
  findByToken(token: string): Promise<PasswordResetItem | null>;
  markAsUsed(internalId: number): Promise<void>;
}
