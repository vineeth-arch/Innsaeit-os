// GS1/EAN check-digit validation — pure math (the standard mod-10 weighted algorithm).
// https://www.gs1.org/services/how-calculate-check-digit-manually

export type Gs1Result = {
  cleaned: string;
  valid: boolean;
  expectedCheckDigit: number;
  actualCheckDigit: number;
};

export function validateGs1(input: string): Gs1Result | null {
  const cleaned = input.replace(/\s|-/g, '');
  if (!/^\d{8}$|^\d{12,14}$/.test(cleaned)) return null;

  const digits = cleaned.split('').map(Number);
  const actualCheckDigit = digits[digits.length - 1];
  const body = digits.slice(0, -1);

  // Weighting is applied from the RIGHT: rightmost body digit gets weight 3.
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    const posFromRight = body.length - i; // 1-indexed from the right
    const weight = posFromRight % 2 === 1 ? 3 : 1;
    sum += body[i] * weight;
  }
  const expectedCheckDigit = (10 - (sum % 10)) % 10;

  return {
    cleaned,
    valid: expectedCheckDigit === actualCheckDigit,
    expectedCheckDigit,
    actualCheckDigit,
  };
}
