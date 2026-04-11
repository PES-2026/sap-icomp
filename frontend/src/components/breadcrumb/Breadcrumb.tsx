"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

type UserRole = "admin" | "student" | "teacher";

const CURRENT_ROLE: UserRole = "admin";

const ROLE_ROOT_PATHS: Record<UserRole, string> = {
  admin: "/admin",
  student: "/aluno",
  teacher: "/professor",
};

const routeNames: Record<string, string> = {
  alunos: "Alunos",
  configuracoes: "Configurações",
  novo: "Novo",
};

const formatSlug = (slug: string) => {
  if (routeNames[slug]) return routeNames[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export function Breadcrumb() {
  const pathname = usePathname();

  const rootPath = ROLE_ROOT_PATHS[CURRENT_ROLE] || "/";

  if (pathname === rootPath || pathname === "/") return null;

  let pathSegments = pathname.split("/").filter(Boolean);

  const rootSegment = rootPath.replace("/", "");
  if (pathSegments[0] === rootSegment) {
    pathSegments = pathSegments.slice(1);
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      <ol className="flex items-center gap-1.5">
        {/* Home link dynamically pointing to the role's root */}
        <li>
          <Link
            href={rootPath}
            className="flex items-center text-[#8a8075] transition-colors hover:text-[#6bc4a6]"
            title="Página Inicial"
          >
            <Home size={16} />
          </Link>
        </li>

        {/* Map through the remaining URL segments */}
        {pathSegments.map((segment, index) => {
          const href = `${rootPath}/${pathSegments.slice(0, index + 1).join("/")}`;

          const isLast = index === pathSegments.length - 1;

          const segmentName = formatSlug(segment);

          return (
            <li key={href} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-[#c2bcaf]" />

              {isLast ? (
                <span className="font-bold text-[#3a3530]" aria-current="page">
                  {segmentName}
                </span>
              ) : (
                <Link
                  href={href}
                  className="font-medium text-[#8a8075] transition-colors hover:text-[#6bc4a6]"
                >
                  {segmentName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
