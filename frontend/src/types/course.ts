export type CourseAcronym = "E.S." | "C.C." | "A.B.I." | "S.I." | "Outros";

export type CourseName =
  | ""
  | "Engenharia de Software"
  | "Ciência da Computação"
  | "A.B.I"
  | "Sistemas de Informação"
  | "Outros";

export interface CourseFromBackend {
  id: string;
  name: string;
}

export enum AttendanceType {
  Learning = "Learning",
  SocioeconomicVulnerability = "SocioeconomicVulnerability",
  Emotional = "Emotional",
  Deficiency = "Deficiency",
  AcademicOrientation = "AcademicOrientation",
  Others = "Others",
}

export const AttendanceTypeLabel: Record<AttendanceType, string> = {
  [AttendanceType.Learning]: "Aprendizado",
  [AttendanceType.SocioeconomicVulnerability]: "Vulnerabilidade Socioeconômica",
  [AttendanceType.Emotional]: "Emocional",
  [AttendanceType.Deficiency]: "Deficiência",
  [AttendanceType.AcademicOrientation]: "Orientação Acadêmica",
  [AttendanceType.Others]: "Outros",
};

export const attendanceTypeOptions = Object.entries(AttendanceTypeLabel).map(
  ([key, label]) => ({
    value: key as AttendanceType,
    label: label,
  }),
);
