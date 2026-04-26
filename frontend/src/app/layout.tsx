import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SAP IComp",
  description: "Serviço de Apoio Pedagógico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className:
              "font-['Nunito','Segoe_UI',sans-serif] text-sm font-medium",
          }}
        />
      </body>
    </html>
  );
}
