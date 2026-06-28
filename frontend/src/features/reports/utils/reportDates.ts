export const formatReportDate = (value: string): string => {
  if (!value) return "Não informada";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Manaus",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatReportLongDate = (
  value: string,
  location = "Manaus-AM",
): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return `${location}, ${value}`;

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Manaus",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return `${location}, ${formattedDate}`;
};
