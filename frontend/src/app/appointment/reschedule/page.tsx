import RescheduleAppointmentCard from "@/features/appointments/components/RescheduleAppointmentCard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function RescheduleAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center text-[#a0998e]">
          <Loader2 className="animate-spin mr-2" size={32} />
          <span>Carregando página de reagendamento...</span>
        </div>
      }
    >
      <RescheduleAppointmentCard />
    </Suspense>
  );
}
