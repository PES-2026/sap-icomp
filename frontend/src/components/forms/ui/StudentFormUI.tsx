import CommonButton from "@/components/common-button/CommonButton";
import { useAppNavigation } from "@/utils/navigator";
import { Check } from "lucide-react";

export const Toast = ({
  message,
  visible,
  type = "success",
}: {
  message: string;
  visible: boolean;
  type?: "success" | "error";
}) => (
  <div
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-[13px] font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)] whitespace-nowrap transition-all duration-250 pointer-events-none z-[2000]
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
    ${type === "success" ? "bg-stone-800" : "bg-red-600"}`}
  >
    {message}
  </div>
);

export const SuccessScreen = ({
  studentName,
  onNew,
  isEditMode,
}: {
  studentName: string;
  onNew: () => void;
  isEditMode: boolean;
}) => {
  const { handleNavigation } = useAppNavigation();

  return (
    <div className="flex flex-col items-center justify-center py-14 px-8 text-center gap-4">
      <div className="w-18 h-18 rounded-full bg-[#6bc4a6] flex items-center justify-center">
        <Check size={36} strokeWidth={3} className="text-white" />
      </div>
      <h2 className="m-0 text-2xl font-bold text-stone-800">
        Aluno {isEditMode ? "atualizado" : "cadastrado"}!
      </h2>
      <p className="m-0 text-sm text-stone-600 max-w-[320px]">
        <strong>{studentName}</strong> foi{" "}
        {isEditMode ? "atualizado" : "registrado"} com sucesso na base de
        alunos.
      </p>
      <div className="flex gap-3 mt-2">
        <CommonButton
          label="Ver lista de alunos"
          onClick={() => handleNavigation({ path: "/admin/alunos" })}
          className="border border-[#e7e4dd] bg-[#faf7f0] hover:bg-[#f0ede8] text-stone-600"
        />
        {!isEditMode && (
          <CommonButton label="Cadastrar Outro" onClick={onNew} />
        )}
      </div>
    </div>
  );
};
