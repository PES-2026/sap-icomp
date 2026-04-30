export function SkeletonStudentTable() {
  const rows = Array.from({ length: 8 });

  return (
    <main className="flex min-w-0 flex-1 flex-col h-full font-sans p-7">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-[#faf7f0] border border-[#ece7db] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 pt-5">
          <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            {/* Head */}
            <thead>
              <tr>
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  </th>
                ))}
              </tr>

              <tr>
                {Array.from({ length: 6 }).map((_, i) => (
                  <td key={i} className="px-4 py-2">
                    <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {rows.map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </main>
  );
}
