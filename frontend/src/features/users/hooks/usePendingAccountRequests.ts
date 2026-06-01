import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { accountRequestService } from "../services/accountRequestService";
import { PendingAccountRequestItem } from "../types/user";

export const usePendingAccountRequests = () => {
  const [requests, setRequests] = useState<PendingAccountRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPendingRequests = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await accountRequestService.getPendingAccountRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error loading pending account requests:", error);
      toast.error("Não foi possível carregar as solicitações pendentes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  return { requests, isLoading, fetchPendingRequests };
};
