"use client";

import { RoleMap } from "@/constants/paths";
import { Role } from "@/features/login/types/login";
import { useStudentById } from "@/features/students/hooks/useStudentById";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CURRENT_ROLE: Lowercase<Role> = "pedagogue";

const routeTranslations: Record<string, string> = {
  students: "Alunos",
  register: "Cadastrar",
  edit: "Editar",
  attendances: "Atendimentos",
  attendance: "Atendimento",
  users: "Usuários",
  pending: "Pendentes",
  settings: "Configurações",
  scheduling: "Agendamentos",
  appointment: "Agendamento",
  profile: "Perfil",
};

const isIdSegment = (segment: string) => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  const numberRegex = /^\d+$/;
  return uuidRegex.test(segment) || numberRegex.test(segment);
};

const formatSegmentName = (segment: string) => {
  if (routeTranslations[segment]) return routeTranslations[segment];
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function StudentNameResolver({ id }: { id: string }) {
  const { student, isLoadingStudent } = useStudentById(id);

  if (isLoadingStudent) {
    return <span className="animate-pulse opacity-70">Carregando...</span>;
  }

  return <span>{student?.name || "Detalhes do Aluno"}</span>;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const rootPath = `/${RoleMap[CURRENT_ROLE.toUpperCase() as Role]}`;

  if (pathname === rootPath || pathname === "/" || pathname === "/appointment")
    return null;

  let pathSegments = pathname.split("/").filter(Boolean);
  const rootSegment = rootPath.replace("/", "");

  if (pathSegments[0] === rootSegment) {
    pathSegments = pathSegments.slice(1);
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link
            href={rootPath}
            className="flex items-center text-[#8a8075] transition-colors hover:text-[#6bc4a6]"
            title="Página Inicial"
          >
            <Home size={16} />
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = `${rootPath}/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          const previousSegment = index > 0 ? pathSegments[index - 1] : "";
          const isId = isIdSegment(segment);
          const isStudentId = isId && previousSegment === "students";

          let SegmentContent;
          if (isStudentId) {
            SegmentContent = <StudentNameResolver id={segment} />;
          } else if (isId) {
            SegmentContent = <span>Detalhes</span>;
          } else {
            SegmentContent = <span>{formatSegmentName(segment)}</span>;
          }

          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-[#c2bcaf]" />

              {isLast ? (
                <span className="font-bold text-[#3a3530]" aria-current="page">
                  {SegmentContent}
                </span>
              ) : (
                <Link
                  href={href}
                  className="font-medium text-[#8a8075] transition-colors hover:text-[#6bc4a6]"
                >
                  {SegmentContent}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
