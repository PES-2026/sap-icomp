"use client";

import AttendanceTypeSection from "@/features/attendance-types/components/AttendanceTypeSection";
import DiagnosticSection from "@/features/diagnostics/components/DiagnosticSection";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] overflow-auto p-4 md:p-8 gap-6 font-sans">
      <AttendanceTypeSection />
      <DiagnosticSection />
    </div>
  );
}
