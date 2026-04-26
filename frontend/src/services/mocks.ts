import { Attendance } from "@/types/attendance";
import { StudentAttendance } from "@/types/student";

export const attendanceMock: Attendance[] = [
  {
    attendanceId: "c3e38734-7731-482d-a2d3-92f72a44598c",
    studentId: "c3e38734-7731-482d-a2d3-92f72a44598c",
    studentName: "Ana Beatriz Silva",
    enrollmentId: "10293847",
    course: "Engenharia de Software",
    period: "1",
    attendanceType: "Presencial",
    attendanceDate: "24/04/2026",
  },
  {
    attendanceId: "9312e742-d698-4448-8316-258079075775",
    studentId: "9312e742-d698-4448-8316-258079075775",
    studentName: "Carlos Eduardo Gomes",
    enrollmentId: "88273645",
    course: "Ciência da Computação",
    period: "4",
    attendanceType: "Remoto",
    attendanceDate: "24/04/2026",
  },
  {
    attendanceId: "0f127457-377a-4228-98e8-d10204780521",
    studentId: "0f127457-377a-4228-98e8-d10204780521",
    studentName: "Mariana Oliveira",
    enrollmentId: "55443322",
    course: "Sistemas de Informação",
    period: "Formado",
    attendanceType: "Presencial",
    attendanceDate: "24/04/2026",
  },
  {
    attendanceId: "65191b29-22a4-49c0-993d-66e3b0816912",
    studentId: "65191b29-22a4-49c0-993d-66e3b0816912",
    studentName: "Ricardo Santos",
    enrollmentId: "90182736",
    course: "Engenharia de Software",
    period: "2",
    attendanceType: "Remoto",
    attendanceDate: "24/04/2026",
  },
  {
    attendanceId: "f9b6e82c-497b-402b-980b-93117565893d",
    studentId: "f9b6e82c-497b-402b-980b-93117565893d",
    studentName: "Fernanda Lima",
    enrollmentId: "66778899",
    course: "Análise e Desenvolvimento de Sistemas",
    period: "6",
    attendanceType: "Presencial",
    attendanceDate: "24/04/2026",
  },
];

export const studentAttendanceMock: Record<string, StudentAttendance> = {
  "0d9c5872-378b-449d-8a90-82e56cd20cdd": {
    externalId: "87c438f7-404b-4e8d-8af7-2d6697f3d2eb",
    internalId: 12,
    enrollmentId: "22353217",
    name: "David Yan dos Santos Prado",
    email: "david.prado@icomp.ufam.edu.br",
    phoneNumber: "(92) 98765-4321",
    dtBirth: "15/03/2001",
    course: "Engenharia de Software",
    difficulties: "Dificuldade de aprendizado",
    removed: false,
    diagnosis: "",
    potential: "",
    createdAt: "24/06/2026 13:55",
    updatedAt: "29/06/2026 18:32",
    attendances: [
      {
        attendanceId: "0c438f7-404b-4e8d-8af7-2f09gjh5d2df",
        attendanceDate: "10/02/2026",
        attendanceType: "Atendimento",
      },
      {
        attendanceId: "21c38f7-404b-4e8d-8af7-2f09gjh5d2dg",
        attendanceDate: "05/02/2026",
        attendanceType: "Orientação",
      },
      {
        attendanceId: "21c438f7-404b-4ed-8af7-2f09gjh5d2dg",
        attendanceDate: "05/02/2026",
        attendanceType: "Orientação",
      },
      {
        attendanceId: "21c438f7-404b-4e8d-af7-2f09gjh5d2dg",
        attendanceDate: "05/02/2026",
        attendanceType: "Orientação",
      },
      {
        attendanceId: "21c438f7-404b-4e8d-8af7-2f0gjh5d2dg",
        attendanceDate: "05/02/2026",
        attendanceType: "Orientação",
      },
      {
        attendanceId: "21c438f7-404b-4e8d-8af7-2f09gjh5ddg",
        attendanceDate: "05/02/2026",
        attendanceType: "Orientação",
      },
      {
        attendanceId: "21c438f7-404b-4e8d-8af7-2f09gjh5d2d",
        attendanceDate: "05/02/2026",
        attendanceType: "Orientação",
      },
    ],
  },
};
