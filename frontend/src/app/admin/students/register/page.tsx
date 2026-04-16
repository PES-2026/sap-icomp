"use client";

import StudentForm from "@/components/forms/StudentForm";
import { useAppNavigation } from "@/utils/navigator";

export default function RegisterStudentPage() {
  const { handleNavigation } = useAppNavigation();
  return <StudentForm onCancel={() => handleNavigation({ isBack: true })} />;
}
