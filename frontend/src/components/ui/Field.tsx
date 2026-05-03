interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const Field = ({
  label,
  error,
  children,
  className = "",
}: FieldProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label
      className={`text-sm font-medium tracking-wide ${
        error ? "text-red-600" : "text-stone-500"
      }`}
    >
      {label}
    </label>
    {children}
    {error && <span className="ml-1.5 text-xs text-red-600">— {error}</span>}
  </div>
);
