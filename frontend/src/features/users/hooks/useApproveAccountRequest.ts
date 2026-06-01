import { useState } from "react";
import toast from "react-hot-toast";

import { accountRequestService } from "../services/accountRequestService";

interface UseApproveAccountRequestOptions {
  onSuccess?: () => void;
}

export const useApproveAccountRequest = (options?: UseApproveAccountRequestOptions) => {
  const [isLoading, setIsLoading] = useState(false);

  const approveRequest = async (id: string, isApproved: boolean, role?: string) => {
    try {
      setIsLoading(true);
      await accountRequestService.approveAccountRequest(id, isApproved, role);
      
      if (isApproved) {
        toast.success("Solicitação aprovada com sucesso.");
      } else {
        toast.success("Solicitação rejeitada com sucesso.");
      }
      
      options?.onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao processar a solicitação.");
    } finally {
      setIsLoading(false);
    }
  };

  return { approveRequest, isLoading };
};
