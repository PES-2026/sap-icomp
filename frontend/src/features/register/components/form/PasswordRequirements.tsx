import { CircleCheck, CircleX } from "lucide-react";
import { passwordRequirements } from "../../utils/passwordRequirements";

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <ul
      id="password-requirements"
      className="mt-1 flex flex-col gap-1"
      aria-label="Requisitos da senha"
    >
      {passwordRequirements.map(({ id, label, validate }) => {
        const isMet = validate(password);

        return (
          <li
            key={id}
            className={`flex items-center gap-1.5 text-xs ${
              isMet ? "text-green-600" : "text-red-600"
            }`}
          >
            {isMet ? (
              <CircleCheck size={14} aria-hidden="true" />
            ) : (
              <CircleX size={14} aria-hidden="true" />
            )}
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
