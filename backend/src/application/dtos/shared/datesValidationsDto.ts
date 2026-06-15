export function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
}

export function validateStartEndDate(startDate?: Date, endDate?: Date, index?: number) {
  if (!startDate && !endDate) return;

  if (!startDate || !endDate) {
    let message = `You must insert a period range with start and end date. The actual values are: start: '${startDate}', end: '${endDate}'`;
    if (index) {
      message += ` for the index ${index}`;
    }
    throw new Error(message);
  }

  if (startDate.getTime() > endDate.getTime()) {
    throw new Error("Start Date must be before End Date!");
  }
}
