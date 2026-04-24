import { PATHS } from "@/constants/paths";
import { cn } from "@/utils/cn";
import { ArrowLeft } from "lucide-react";

export default function AttendanceEdit() {
  return (
    <div className="flex h-full items-center justify-center bg-[#f5f0e8] p-4 font-sans">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-[64px] leading-none">🚧</div>
        <h1 className="mb-2 text-2xl font-extrabold text-[#3a3530]">
          A página está em construção...
        </h1>
        <a
          href={PATHS.attendances_list}
          className={cn(
            "mt-6 inline-flex items-center justify-center gap-2",
            "rounded-[10px] bg-[#6bc4a6] px-6 py-2.5",
            "text-[13px] font-bold text-white no-underline",
            "transition-colors duration-150 hover:bg-[#52b594]",
          )}
        >
          <ArrowLeft size={16} />
          <span>Voltar à lista de atendimentos</span>
        </a>
      </div>
    </div>
  );
}
