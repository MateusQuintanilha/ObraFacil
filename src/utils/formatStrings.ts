/**
 * Remove acentos e caracteres especiais de uma string.
 */
export const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Remove espaços extras, quebras de linha e tabulações.
 */
export const cleanString = (str: string) => {
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Gera um slug URL amigável a partir de uma string.
 * Ex.: "João da Silva" → "joao-da-silva"
 */
export const slugify = (str: string) => {
  return removeAccents(str)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Formata número como percentual (ex.: 0.15 → 15%).
 */
export const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

/**
 * Formata número com separadores brasileiros (ex.: 1234567 → 1.234.567).
 */
export const formatNumber = (value: number) => {
  return value.toLocaleString('pt-BR');
};

/**
 * Capitaliza a primeira letra de uma string.
  * Ex: "segunda" → "Segunda"
 */
export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitaliza todas as palavras de uma string.
 */
export const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(^\w{1})|(\s+\w{1})/g, (match) => match.toUpperCase());
};
