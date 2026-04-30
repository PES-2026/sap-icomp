"use client";

import AttendanceForm from "@/components/forms/AttendanceForm";
import { useAppNavigation } from "@/utils/navigator";

export default function RegisterAttendancePage() {
  const { handleNavigation } = useAppNavigation();

  return (
    <AttendanceForm
      isEditMode={true}
      onCancel={() => handleNavigation({ isBack: true })}
    />
  );
}
