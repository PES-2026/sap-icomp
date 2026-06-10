"use client";

import AttendanceForm from "@/features/attendances/components/form/AttendanceForm";
import { useAppNavigation } from "@/utils/navigator";

export default function RegisterAttendancePage() {
  const { handleNavigation } = useAppNavigation();

  return <AttendanceForm onCancel={() => handleNavigation({ isBack: true })} />;
}
