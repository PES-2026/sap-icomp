export class ReportTransformerService {
  static transformStudentInformation(name: string, registration: string, course: string): string {
    const editorState = {
      root: {
        children: [
          {
            children: [{ detail: 0, format: 0, mode: "normal", style: "", text: `Aluno(a): ${name}`, type: "text", version: 1 }],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
          {
            children: [{ detail: 0, format: 0, mode: "normal", style: "", text: `Matrícula: ${registration}`, type: "text", version: 1 }],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
          {
            children: [{ detail: 0, format: 0, mode: "normal", style: "", text: `Curso: ${course}`, type: "text", version: 1 }],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    };
    return JSON.stringify(editorState);
  }
}
