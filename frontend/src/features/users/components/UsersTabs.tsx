"use client";

import { UserPlus, Users } from "lucide-react";
import { useState } from "react";
import PendingRequestsTable from "./table/PendingRequestsTable";
import UserTable from "./table/UserTable";

export default function UsersTabs() {
  const [activeTab, setActiveTab] = useState<"users" | "pending">("users");

  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b border-gray-200">
        <nav className="flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("users")}
            className={`
              flex cursor-pointer items-center gap-3 whitespace-nowrap border-b-3 py-3 w-50 justify-center text-sm font-medium
              ${
                activeTab === "users"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }
            `}
          >
            <Users className="h-4.5 w-4.5" />
            Usuários Ativos
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`
              flex cursor-pointer items-center gap-3 whitespace-nowrap border-b-3 py-3 w-50 justify-center text-sm font-medium
              ${
                activeTab === "pending"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }
            `}
          >
            <UserPlus className="h-4.5 w-4.5" />
            Solicitações Pendentes
          </button>
        </nav>
      </div>

      <div className="flex-1 w-full">
        {activeTab === "users" ? <UserTable /> : <PendingRequestsTable />}
      </div>
    </div>
  );
}
