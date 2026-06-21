import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { userService } from "../services/userService";
import { UserFilters, UserListItem } from "../types/user";

export const useUsers = (
  page: number,
  limit: number,
  filters: UserFilters = {},
) => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { name, userStatus } = filters;

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await userService.getUsers(page, limit, {
        name,
        userStatus,
      });

      setUsers(data.items ?? []);
      setTotalItems(data.totalItems ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error("Error loading users list:", error);
      toast.error("Não foi possível carregar a lista de usuários.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, name, userStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const removeUser = useCallback(
    async (id: string) => {
      try {
        await userService.remove(id);
        toast.success("Usuário removido com sucesso.");
        fetchUsers();
      } catch (error) {
        console.error("Error removing user:", error);
        toast.error("Não foi possível remover o usuário.");
      }
    },
    [fetchUsers],
  );

  const activateUser = useCallback(
    async (id: string) => {
      try {
        await userService.activate(id);
        toast.success("Usuário ativado com sucesso.");
        fetchUsers();
      } catch (error) {
        console.error("Error activating user:", error);
        toast.error("Não foi possível ativar o usuário.");
      }
    },
    [fetchUsers],
  );

  return {
    users,
    totalItems,
    totalPages,
    isLoading,
    fetchUsers,
    removeUser,
    activateUser,
  };
};
