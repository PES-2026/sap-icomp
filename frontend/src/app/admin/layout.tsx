import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen font-['Nunito','Segoe_UI',sans-serif] overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-[#f5f0e8]">
        <Header />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
