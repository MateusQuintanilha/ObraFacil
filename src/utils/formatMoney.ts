export function formatCurrency(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(number)
    ? 'R$ 0,00'
    : number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
}

export function parseMoneyString(value: string): number {
  const clean = value.replace(/\s|R\$|\./g, '').replace(',', '.');
  const number = parseFloat(clean);
  return isNaN(number) ? 0 : number;
}

export function isValidMoney(value: string): boolean {
  const cleaned = value.replace(/\s|R\$|\./g, '').replace(',', '.');
  return !isNaN(parseFloat(cleaned));
}
