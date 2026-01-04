export const generateMatNumber = (
  department?: string,
  entryYear?: number
): string => {
  const prefix = department ? department.substring(0, 3).toUpperCase() : "SCH";
  const year = entryYear ?? new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);

  const matNumber = `${prefix}${year}${random}`;
  return matNumber;
};
