import { Student } from "../../entities/student.js";

export type SaveStudentParams = {
  student: Student;
  idRole: number;
  removed: boolean;
};

export interface IStudentRepository {
  existsByCpf(cpf: string): Promise<boolean>;
  findRoleIdByName(roleName: string): Promise<number | null>;
  save(params: SaveStudentParams): Promise<Student>;
}
