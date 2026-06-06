"use client";

import { PATHS } from "@/constants/paths";
import { redirect, useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const studentId = decodeURIComponent((params?.studentId as string) ?? "");
  redirect(PATHS.visualize_student(studentId));
}
