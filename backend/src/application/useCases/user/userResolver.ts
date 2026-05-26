import { RoleEnum } from "@domain/enum/role";
import { IPedagogueRepository } from "@domain/repositories/pedagogueRepository";
import { IProfessorRepository } from "@domain/repositories/professorRepository";

type ResolvedUser = {
  userEntity: any;
  role: RoleEnum;
};

export class UserResolver {
  constructor(
    private professorRepository: IProfessorRepository,
    private pedagogueRepository: IPedagogueRepository,
  ) {}

  async execute(email: string): Promise<ResolvedUser | null> {
    const professor = await this.professorRepository.findByEmail(email);
    if (professor) {
      return { userEntity: professor, role: RoleEnum.PROFESSOR };
    }

    const pedagogue = await this.pedagogueRepository.findByEmail(email);
    if (pedagogue) {
      return { userEntity: pedagogue, role: RoleEnum.PEDAGOGUE };
    }

    return null;
  }
}
