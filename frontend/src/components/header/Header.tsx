import { Breadcrumb } from "../breadcrumb/Breadcrumb";

export default function Header() {
  return (
    <header className="bg-[#faf7f0] border-b border-[#ece7db] px-4 py-4 flex items-center gap-4 shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-12 h-12 rounded-full bg-[#6bc4a6] flex items-center justify-center shrink-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <div>
          <div className="text-lg font-extrabold text-[#3a3530]">
            Olá, Ana Lúcia
          </div>
          <div className="text-sm text-[#9a9590]">
            <Breadcrumb />
          </div>
        </div>
      </div>
    </header>
  );
}
