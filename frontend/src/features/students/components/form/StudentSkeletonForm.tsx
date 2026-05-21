export function StudentSkeletonForm() {
  const input = "h-10 w-full bg-gray-200 rounded-md animate-pulse";
  const textarea = "w-full bg-gray-200 rounded-md animate-pulse";

  return (
    <main className="flex min-w-0 flex-1 flex-col h-full font-sans p-7">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0">
        <div className="px-7 pt-7 pb-4">
          <div className="h-7 w-64 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex-1 px-7 pb-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px] gap-3.5">
            <div className={input} />
            <div className={input} />
            <div className={input} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-3.5">
            <div className={input} />
            <div className={input} />
            <div className={input} />
          </div>

          <div className={input} />

          <div className={`${textarea} h-16`} />

          <div className={`${textarea} h-32`} />
        </div>

        <div className="p-4 px-7 flex justify-end gap-3 border-t border-stone-200 bg-stone-50/50">
          <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </main>
  );
}
