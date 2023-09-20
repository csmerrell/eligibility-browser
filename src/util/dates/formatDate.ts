export const formatDate = (date: Date): string => {
  // Get year, month, and day separately
  const year: string = date.getFullYear().toString();
  const optionsMonth: Intl.DateTimeFormatOptions = { month: 'short' };
  const month: string = new Intl.DateTimeFormat('en-US', optionsMonth).format(date);
  const day: string = date.getDate().toString().padStart(2, '0'); // Pad single-digit days with a leading zero

  // Combine them into the desired format
  return `${year}, ${month}, ${day}`;
}
