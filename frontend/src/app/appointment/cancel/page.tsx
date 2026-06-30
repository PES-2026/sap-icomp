import CancelAppointmentCard from "@/features/appointments/components/CancelAppointmentCard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function CancelAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center text-[#a0998e]">
          <Loader2 className="animate-spin mr-2" size={32} />
          <span>Carregando página de cancelamento...</span>
        </div>
      }
    >
      <CancelAppointmentCard />
    </Suspense>
  );
}
