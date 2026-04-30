"use client";

import { redirect, useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const studentId = decodeURIComponent((params?.studentId as string) ?? "");
  redirect(`/admin/students/${studentId}`);
}
