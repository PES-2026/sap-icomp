import { SelectOption } from "@/types/selectOption";
import { SelectInput } from "../select-input/FilterSelect";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  page: number;
  setPage: (v: number) => void;
  limit: number;
  setLimit: (v: number) => void;
  limitOptions: SelectOption[];
  lengthData: number;
}

export default function TablePagination({
  page,
  setPage,
  limit,
  setLimit,
  limitOptions,
  lengthData,
}: TablePaginationProps) {
  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  return (
    <div className="flex items-center justify-between shrink-0 border-t border-[#f0ebe0] px-6 py-3 text-sm text-[#a0a098]">
      <div className="flex items-center gap-4">
        <span>Exibindo página {page}</span>

        <div className="w-40">
          <SelectInput
            value={String(limit)}
            onChange={handleLimitChange}
            options={limitOptions}
            placeholder="Itens por página"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setPage(Math.max(page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-lg border border-[#e2ddd5] bg-white px-3 py-1.5 text-[#4a4540] transition-colors hover:bg-[#faf8f4] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={lengthData < limit}
          className="flex items-center gap-1 rounded-lg border border-[#e2ddd5] bg-white px-3 py-1.5 text-[#4a4540] transition-colors hover:bg-[#faf8f4] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
