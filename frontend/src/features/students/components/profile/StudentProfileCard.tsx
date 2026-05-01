import CommonButton from "@/components/common-button/CommonButton";
import { PATHS } from "@/constants/paths";
import { cn } from "@/utils/cn";
import { useAppNavigation } from "@/utils/navigator";
import { ArrowLeft, BookOpen, Cake, Mail, Phone } from "lucide-react";
import { Student } from "../../types/student";

interface StudentProfileCardProps {
  student: Student;
}

export default function StudentProfileCard({
  student,
}: StudentProfileCardProps) {
  const { handleNavigation } = useAppNavigation();

  return (
    <div className="rounded-2xl bg-white shadow-sm p-5">
      <div className="flex items-start gap-5">
        <CommonButton
          onClick={() => handleNavigation({ path: PATHS.students_list })}
          label=""
          title="Voltar"
          startIcon={ArrowLeft}
          sizeIcon={20}
          className="flex w-fit items-center gap-0 rounded-xl p-2 text-sm font-semibold text-[#6bc4a6] bg-transparent transition-colors hover:bg-[#f1efe9]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-lg font-bold text-[#2a2520] leading-tight truncate">
              {student.name}
            </h1>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
                !student.removed
                  ? "bg-emerald-100 text-[#6bc4a6]"
                  : "bg-red-100 text-red-400",
              )}
            >
              {!student.removed ? "Ativo" : "Inativo"}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#7a7268]">
            <BookOpen size={13} className="shrink-0 text-[#6bc4a6]" />
            {student.course}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="flex items-center gap-1.5 text-sm text-[#7a7268]">
              <Mail size={13} className="shrink-0 text-[#6bc4a6]" />
              {student.email}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#7a7268]">
              <Phone size={13} className="shrink-0 text-[#6bc4a6]" />
              {student.phoneNumber}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#7a7268]">
              <Cake size={13} className="shrink-0 text-[#6bc4a6]" />
              {student.dtBirth}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex shrink-0 gap-3">
          <div className="rounded-xl bg-[#f5f0e8] px-4 py-2.5 text-center min-w-22.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0998e] mb-0.5">
              Matrícula
            </p>
            <p className="text-sm font-bold text-[#3a3530]">
              {student.enrollmentId}
            </p>
          </div>
          <div className="rounded-xl bg-[#fff8ec] px-4 py-2.5 text-center min-w-27.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a0998e] mb-0.5">
              Necessidades
            </p>
            <p className="text-sm font-bold text-[#7a5c1e] leading-tight">
              {student.difficulties ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
