import CommonButton from "@/components/ui/CommonButton";
import { useAppNavigation } from "@/utils/navigator";
import { Check } from "lucide-react";

interface SuccessScreenFormProps {
  title: string;
  message: string;
  listPath: string;
  listButtonLabel?: string;
  newButtonLabel?: string;
  isEditMode?: boolean;
  onAddNew?: () => void;
}

export const SuccessScreenForm = ({
  title,
  message,
  listPath,
  listButtonLabel = "Voltar para a Lista",
  newButtonLabel = "Cadastrar Novo",
  isEditMode = false,
  onAddNew,
}: SuccessScreenFormProps) => {
  const { handleNavigation } = useAppNavigation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-8 py-14 text-center">
      <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#6bc4a6]">
        <Check size={36} strokeWidth={3} className="text-white" />
      </div>

      <h2 className="m-0 text-2xl font-bold text-stone-800">{title}</h2>
      <p className="m-0 max-w-[320px] text-sm text-stone-600">{message}</p>

      <div className="mt-2 flex gap-3">
        <CommonButton
          label={listButtonLabel}
          onClick={() => handleNavigation({ path: listPath })}
          className="border border-[#e7e4dd] bg-[#faf7f0] text-stone-600 hover:bg-[#f0ede8]"
        />

        {!isEditMode && onAddNew && (
          <CommonButton label={newButtonLabel} onClick={onAddNew} />
        )}
      </div>
    </div>
  );
};
