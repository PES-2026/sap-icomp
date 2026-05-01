import CommonButton from "@/components/common-button/CommonButton";
import { ConfirmModal } from "@/components/confirm-modal/ConfirmModal";
import { PATHS } from "@/constants/paths";
import { Student } from "@/types/student";
import { cn } from "@/utils/cn";
import { useAppNavigation } from "@/utils/navigator";
import { Plus, UserPen, UserRoundX } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { studentService } from "../../services/studentService";

interface StudentFooterProps {
  student: Student;
}

export default function StudentFooter({ student }: StudentFooterProps) {
  const [showDisableStudent, setShowDisableStudent] = useState<boolean>(false);

  const { handleNavigation } = useAppNavigation();

  const handleDisableStudent = async () => {
    try {
      await studentService.deleteStudent(student.externalId);
      toast.success(
        !student.removed
          ? "Aluno inativado com sucesso."
          : "Aluno reativado com sucesso.",
      );
      handleNavigation({ path: PATHS.students_list });
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Erro ao comunicar com o servidor.",
      );
    } finally {
      setShowDisableStudent(false);
    }
  };

  return (
    <>
      <div className="shrink-0 rounded-2xl bg-white shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <CommonButton
            label={student.removed ? "Reativar Aluno" : "Inativar Aluno"}
            onClick={() => setShowDisableStudent(true)}
            endIcon={UserRoundX}
            sizeIcon={20}
            className={cn(
              "text-sm font-semibold bg-transparent",
              student.removed
                ? "hover:bg-emerald-100 ring-1 ring-emerald-400 text-emerald-400"
                : "hover:bg-red-100 ring-1 ring-red-400 text-red-400",
            )}
          />

          <CommonButton
            label="Editar Aluno"
            onClick={() =>
              handleNavigation({ path: PATHS.edit_student(student.externalId) })
            }
            endIcon={UserPen}
            sizeIcon={20}
          />

          <div className="h-4 w-px bg-[#e8e0d5]" />

          <div className="flex flex-wrap gap-4 text-xs text-[#a0998e]">
            <span>
              <span className="font-semibold text-[#6a6258]">Criado em</span>{" "}
              {student.createdAt}
            </span>
            <span>
              <span className="font-semibold text-[#6a6258]">
                Atualizado em
              </span>{" "}
              {student.updatedAt}
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex gap-2.5">
            <CommonButton
              label="Fazer Registro"
              endIcon={Plus}
              onClick={() =>
                handleNavigation({
                  path: PATHS.register_attendance(student.externalId),
                })
              }
              className="bg-[#6bc4a6] text-white hover:bg-[#52b594] text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showDisableStudent}
        title={!student.removed ? "Inativar Aluno" : "Reativar Aluno"}
        message={
          !student.removed
            ? `Tem certeza que deseja inativar ${student.name}? O aluno não aparecerá mais na listagem ativa.`
            : `Deseja reativar ${student.name}? O aluno voltará à listagem ativa.`
        }
        confirmLabel={!student.removed ? "Inativar" : "Reativar"}
        confirmColor={!student.removed ? "critical" : "primary"}
        onConfirm={handleDisableStudent}
        onCancel={() => setShowDisableStudent(false)}
      />
    </>
  );
}
