export interface ExtraFee {
  id: string;            // UUID único da taxa extra
  description: string;   // Nome ou descrição da taxa (ex.: Frete, Deslocamento)
  value: number;        // Valor da taxa
}
