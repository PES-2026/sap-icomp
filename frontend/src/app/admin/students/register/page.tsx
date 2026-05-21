"use client";

import StudentForm from "@/features/students/components/form/StudentForm";
import { useAppNavigation } from "@/utils/navigator";

export default function RegisterStudentPage() {
  const { handleNavigation } = useAppNavigation();
  return <StudentForm onCancel={() => handleNavigation({ isBack: true })} />;
}
