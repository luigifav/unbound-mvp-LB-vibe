export const parseBRLToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,.]/g, '');
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  if (hasComma && hasDot) {
    const withoutThousands = cleaned.replace(/\./g, '');
    return parseFloat(withoutThousands.replace(',', '.'));
  } else if (hasComma) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      return parseFloat(cleaned.replace(',', '.'));
    } else {
      return parseFloat(cleaned.replace(/,/g, ''));
    }
  } else if (hasDot) {
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      return parseFloat(cleaned);
    } else {
      return parseFloat(cleaned.replace(/\./g, ''));
    }
  }

  return parseFloat(cleaned) || 0;
};

export const parseUSDToNumber = (value: string): number => {
  const cleaned = value.replace(/[^\d,.]/g, '');
  const hasComma = cleaned.includes(',');
  const hasDot = cleaned.includes('.');

  if (hasComma && hasDot) {
    const withoutThousands = cleaned.replace(/,/g, '');
    return parseFloat(withoutThousands);
  } else if (hasComma) {
    return parseFloat(cleaned.replace(/,/g, ''));
  } else if (hasDot) {
    return parseFloat(cleaned);
  }

  return parseFloat(cleaned) || 0;
};

export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatUSD = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatBRLInput = (value: string): string => {
  const numValue = parseBRLToNumber(value);
  if (numValue === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numValue);
};

export const formatUSDInput = (value: string): string => {
  const numValue = parseUSDToNumber(value);
  if (numValue === 0) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numValue);
};

export const formatRate = (rate: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);
};
