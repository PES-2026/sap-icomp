export default function Home() {
  return (
    <main className="flex h-full min-h-[80vh] flex-col items-center justify-center p-8 font-sans">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center space-y-5 rounded-2xl border border-[#ece7db] bg-[#faf7f0] p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="inline-flex items-center justify-center rounded-full bg-[#e8f7f2] px-3.5 py-1.5 text-sm font-semibold text-[#52b594]">
          Painel Administrativo
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[#3a3530] sm:text-5xl">
          Bem-vindo ao <span className="text-[#6bc4a6]">SAP IComp</span>
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-[#6a6560]">
          Sistema de Acompanhamento Psicopedagógico do Instituto de Computação.
          <br />
          <br />
          Utilize o menu lateral para gerenciar alunos.
        </p>
      </div>
    </main>
  );
}
