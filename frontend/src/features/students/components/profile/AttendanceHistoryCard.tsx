import CommonButton from "@/components/common-button/CommonButton";
import { ConfirmModal } from "@/components/confirm-modal/ConfirmModal";
import { SelectInput } from "@/components/select-input/FilterSelect";
import { PATHS } from "@/constants/paths";
import { useAttendancesByStudent } from "@/features/attendances/hooks/useAttendancesByStudent";
import { useAttendanceTypesOptions } from "@/features/attendances/hooks/useAttendanceTypesOptions";
import { attendanceService } from "@/features/attendances/services/attendanceService";
import { Calendar, Edit, Eye, FileX, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface AttendanceHistoryCardProps {
  studentId: string;
}

export default function AttendanceHistoryCard({
  studentId,
}: AttendanceHistoryCardProps) {
  const [filterType, setFilterType] = useState<string>("Todos os tipos");
  const [attendanceId, setAttendanceId] = useState<string>("");
  const [showDisableAttendance, setShowDisableAttendance] =
    useState<boolean>(false);

  const {
    attendancesByStudent,
    isLoadingAttendancesByStudent,
    fetchAttendances,
  } = useAttendancesByStudent(studentId);
  const { attendanceTypesOptions } = useAttendanceTypesOptions();

  const filteredAttendances = studentId
    ? attendancesByStudent.filter(
        (a) =>
          filterType === "Todos os tipos" || a.attendanceType === filterType,
      )
    : [];

  const handleDisableAttendance = async () => {
    try {
      await attendanceService.removeAttendance(attendanceId);
      toast.success(`Atendimento desativado com sucesso: ${attendanceId}`);
      fetchAttendances();
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Erro ao comunicar com o servidor.",
      );
    } finally {
      setShowDisableAttendance(false);
      setAttendanceId("");
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-sm overflow-hidden min-h-0">
        <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-[#ede8df]">
          <div>
            <h2 className="text-sm font-bold text-[#2a2520]">
              Histórico de Atendimentos
            </h2>
            <p className="text-xs text-[#a0998e] mt-0.5">
              {filteredAttendances.length} registro
              {filteredAttendances.length !== 1 ? "s" : ""} encontrado
              {filteredAttendances.length !== 1 ? "s" : ""}
            </p>
          </div>
          <SelectInput
            value={filterType}
            onChange={setFilterType}
            options={attendanceTypesOptions}
            placeholder="Todos os tipos"
            width="w-55"
            isSetLabel={true}
          />
        </div>

        {isLoadingAttendancesByStudent && false ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#53bb98] mb-3" />
            <p className="text-sm font-medium text-[#7a7268]">
              Carregando atendimentos do aluno...
            </p>
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-hidden flex flex-col ">
            <div className="flex-1 flex flex-col overflow-hidden rounded-2xl bg-[#d4f0e8] ring-1 ring-[#badad1]">
              <div className="custom-scroll flex-1 overflow-y-auto divide-y divide-[#badad1]">
                {filteredAttendances.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
                      <Calendar size={20} className="text-[#5c544c]" />
                    </div>
                    <p className="text-sm font-medium text-[#5c544c]">
                      Nenhum atendimento encontrado
                    </p>
                    <p className="mt-1 text-xs text-[#5c544c]">
                      Tente ajustar o filtro de tipo
                    </p>
                  </div>
                ) : (
                  filteredAttendances.map((attendance, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between px-6 py-4 transition-colors duration-100 hover:bg-[#cde9e1]"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#2a2520]">
                            {attendance.attendanceType}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#1a6e4e]">
                            <Calendar size={11} />
                            {attendance.attendanceDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Link
                          href={PATHS.visualize_attendance(
                            studentId,
                            attendance.attendanceId,
                          )}
                          title="Visualizar"
                          className="flex items-center rounded-md p-1 text-[#53bb98] transition-colors duration-150 hover:bg-[#a5e1cd]"
                        >
                          <Eye size={20} />
                        </Link>
                        <Link
                          href={PATHS.edit_attendance(
                            studentId,
                            attendance.attendanceId,
                          )}
                          title="Editar"
                          className="flex items-center rounded-md p-1 text-[#b0a898] transition-colors duration-150 hover:bg-[#d0d0d0]"
                        >
                          <Edit size={20} />
                        </Link>
                        <CommonButton
                          label=""
                          title="Inativar"
                          onClick={() => {
                            setAttendanceId(attendance.attendanceId);
                            setShowDisableAttendance(true);
                          }}
                          startIcon={FileX}
                          sizeIcon={20}
                          className="flex items-center rounded-md p-1 text-red-400 transition-colors duration-150 bg-transparent hover:bg-red-200 gap-0"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal confirm to delete attendance */}
      <ConfirmModal
        open={showDisableAttendance}
        title="Inativar Atendimento"
        message="Tem certeza que deseja inativar o atendimento?"
        confirmLabel="Inativar"
        confirmColor="critical"
        onConfirm={handleDisableAttendance}
        onCancel={() => {
          setShowDisableAttendance(false);
          setAttendanceId("");
        }}
      />
    </>
  );
}
