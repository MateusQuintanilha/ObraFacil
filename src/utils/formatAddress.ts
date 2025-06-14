import type { Address } from '@/models/shared/address';
import { cleanString } from '@/utils/formatStrings';

export function getFormattedAddressParts(address?: Partial<Address>) {
  if (!address) {
    return {
      fullAddress: '',
      cep: '',
    };
  }

  const street = cleanString(address.street || '');
  const number = cleanString(address.number || '');
  const neighborhood = cleanString(address.neighborhood || '');
  const city = cleanString(address.city || '');
  const state = cleanString(address.state || '');
  const cep = cleanString(address.cep || '');

  const line1 = street && number ? `${street}, ${number}` : street;
  const line2 = neighborhood;
  const line3 = city && state ? `${city} - ${state}` : city || state;

  const fullAddress = [line1, line2, line3].filter(Boolean).join(' - ');

  return {
    fullAddress,
    cep,
  };
}
