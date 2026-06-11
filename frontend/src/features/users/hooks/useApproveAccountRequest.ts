import { useState } from "react";
import toast from "react-hot-toast";

import { accountRequestService } from "../services/accountRequestService";
import { UserRole } from "../types/user";

interface UseApproveAccountRequestOptions {
  onSuccess?: () => void;
}

export const useApproveAccountRequest = (
  options?: UseApproveAccountRequestOptions,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const approveRequest = async (
    id: string,
    isApproved: boolean,
    role?: UserRole,
  ) => {
    try {
      setIsLoading(true);
      await accountRequestService.approveAccountRequest(id, isApproved, role);
      
      if (isApproved) {
        toast.success("Solicitação aprovada com sucesso.");
      } else {
        toast.success("Solicitação reprovada com sucesso.");
      }

      options?.onSuccess?.();
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao processar a solicitação.";

      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { approveRequest, isLoading };
};
