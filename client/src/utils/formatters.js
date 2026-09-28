const bengaliNumberFormatter = new Intl.NumberFormat('bn-BD', {
  maximumFractionDigits: 2,
});
const bengaliDigits = '০১২৩৪৫৬৭৮৯';

export const formatNumber = (amount) => {
  const value = Number(amount ?? 0);
  return bengaliNumberFormatter.format(Number.isFinite(value) ? value : 0);
};

export const formatPrice = (amount) => `৳ ${formatNumber(amount)}`;

export const formatDigits = (value) =>
  String(value ?? '').replace(/[0-9]/g, (digit) => bengaliDigits[Number(digit)]);
