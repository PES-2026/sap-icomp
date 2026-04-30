"use client";

import { useRouter } from "next/navigation";

type NavigationProps =
  | { isBack: true; path?: never }
  | { isBack?: false; path: string };

export function useAppNavigation() {
  const router = useRouter();

  const handleNavigation = ({ path, isBack }: NavigationProps) => {
    if (isBack) {
      router.back();
    } else if (path) {
      router.push(path);
    }
  };

  return { handleNavigation };
}
