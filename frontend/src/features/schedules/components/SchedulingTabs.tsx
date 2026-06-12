"use client";

import { CalendarDays, CalendarPlus, ClipboardClock } from "lucide-react";
import { useState } from "react";
import ScheduleTable from "./list/ScheduleTable";
import PendingScheduleTable from "./pending/PendingScheduleTable";
import ScheduleForm from "./ScheduleForm";

type SchedulingTab = "pending" | "schedules" | "availability";

export default function SchedulingTabs() {
  const [activeTab, setActiveTab] = useState<SchedulingTab>("schedules");

  const tabClass = (tab: SchedulingTab) => `
    flex w-50 cursor-pointer items-center justify-center gap-3 whitespace-nowrap border-b-3 py-3 text-sm font-medium
    ${
      activeTab === tab
        ? "border-emerald-500 text-emerald-600"
        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
    }
  `;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b border-gray-200">
        <nav
          className="flex overflow-x-auto"
          aria-label="Gestão de agendamentos"
        >
          <button
            type="button"
            onClick={() => setActiveTab("schedules")}
            className={tabClass("schedules")}
          >
            <CalendarDays className="h-4.5 w-4.5" />
            Agendamentos
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={tabClass("pending")}
          >
            <ClipboardClock className="h-4.5 w-4.5" />
            Solicitações pendentes
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("availability")}
            className={tabClass("availability")}
          >
            <CalendarPlus className="h-4.5 w-4.5" />
            Criar agenda
          </button>
        </nav>
      </div>

      <div className="min-h-0 w-full flex-1">
        {activeTab === "pending" ? (
          <PendingScheduleTable />
        ) : activeTab === "schedules" ? (
          <ScheduleTable />
        ) : (
          <ScheduleForm />
        )}
      </div>
    </div>
  );
}
