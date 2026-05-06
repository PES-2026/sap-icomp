interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export const Field = ({
  label,
  error,
  children,
  className = "",
  required = false,
}: FieldProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label
      className={`text-sm font-medium tracking-wide ${
        error ? "text-red-600" : "text-stone-500"
      }`}
    >
      {label}
      {required && (
        <span
          className="ml-1 text-red-500"
          aria-hidden="true"
          title="Campo obrigatório"
        >
          *
        </span>
      )}
    </label>
    {children}
    {error && <span className="ml-1.5 text-xs text-red-600">— {error}</span>}
  </div>
);
