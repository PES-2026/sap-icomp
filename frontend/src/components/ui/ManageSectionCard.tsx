"use client";

import { ReactNode } from "react";

interface ManageSectionCardProps {
  title: string;
  searchInputs: ReactNode;
  actionButton: ReactNode;
  children: ReactNode;
}

export function ManageSectionCard({
  title,
  searchInputs,
  actionButton,
  children,
}: ManageSectionCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#ece7db] bg-[#faf7f0] p-6 shadow-sm w-full">
      <h2 className="text-xl font-bold text-[#3a3530] m-0">{title}</h2>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">{searchInputs}</div>
        <div>{actionButton}</div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2">{children}</div>
    </section>
  );
}
