import { cleanNumber } from "./validation";

export const validateCEP = (cep: string): boolean =>
  /^\d{8}$/.test(cleanNumber(cep));

export const formatCEP = (cep: string): string => {
  const cleaned = cleanNumber(cep);
  if (cleaned.length !== 8) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};
