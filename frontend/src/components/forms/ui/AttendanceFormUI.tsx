import CommonButton from "@/components/common-button/CommonButton";
import { PATHS } from "@/constants/paths";
import { useAppNavigation } from "@/utils/navigator";
import { Check } from "lucide-react";

export const SuccessScreen = ({
  studentId,
  onNew,
  isEditMode,
}: {
  studentId: string;
  onNew: () => void;
  isEditMode: boolean;
}) => {
  const { handleNavigation } = useAppNavigation();

  return (
    <div className="h-full flex flex-col items-center justify-center py-14 px-8 text-center gap-4">
      <div className="w-18 h-18 rounded-full bg-[#6bc4a6] flex items-center justify-center">
        <Check size={36} strokeWidth={3} className="text-white" />
      </div>
      <h2 className="m-0 text-2xl font-bold text-stone-800">
        Atendimento {isEditMode ? "atualizado" : "cadastrado"}!
      </h2>
      <p className="m-0 text-sm text-stone-600 max-w-[320px]">
        O atendimento foi {isEditMode ? "atualizado" : "registrado"} com
        sucesso.
      </p>
      <div className="flex gap-3 mt-2">
        <CommonButton
          label="Voltar para Aluno"
          onClick={() =>
            handleNavigation({ path: PATHS.visualize_student(studentId) })
          }
          className="border border-[#e7e4dd] bg-[#faf7f0] hover:bg-[#f0ede8] text-stone-600"
        />
        {!isEditMode && (
          <CommonButton label="Cadastrar Outro" onClick={onNew} />
        )}
      </div>
    </div>
  );
};
