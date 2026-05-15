import { SelectOption } from "@/types/selectOption";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { diagnosticService } from "../services/diagnosticService";

export const useDiagnosticsOptions = () => {
  const [diagnosticsOptions, setDiagnosticsOptions] = useState<SelectOption[]>(
    [],
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await diagnosticService.getAllDiagnostics(1, 100);

        const mappedOptions: SelectOption[] = response.items.map(
          (diagnostic) => ({
            value: diagnostic.id,
            label: diagnostic.name,
          }),
        );

        setDiagnosticsOptions(mappedOptions);
      } catch (err) {
        console.error("Error to fetch diagnoses: ", err);
        toast.error("Não foi possível carregar as opções de diagnósticos.");
      }
    };

    fetchCourses();
  }, []);

  return { diagnosticsOptions };
};
