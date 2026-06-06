import { SelectOption } from "@/types/selectOption";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../services/userService";

export const usePedagogueOptions = () => {
  const [pedagogueOptions, setPedagogueOptions] = useState<SelectOption[]>([]);
  const [isLoadingPedagogues, setIsLoadingPedagogues] = useState(true);

  useEffect(() => {
    const fetchPedagogues = async () => {
      try {
        setIsLoadingPedagogues(true);

        const response = await userService.getUsers(1, 100, {
          userStatus: "ENABLED",
        });

        const mappedOptions: SelectOption[] = (response.items ?? [])
          .filter((user) => user.role === "PEDAGOGUE")
          .map((user) => ({
            value: user.id,
            label: user.name,
          }));

        setPedagogueOptions(mappedOptions);
      } catch (err) {
        console.error("Error to fetch pedagogues options: ", err);
        toast.error("Não foi possível carregar as opções de pedagogos.");
      } finally {
        setIsLoadingPedagogues(false);
      }
    };

    fetchPedagogues();
  }, []);

  return { pedagogueOptions, isLoadingPedagogues };
};
