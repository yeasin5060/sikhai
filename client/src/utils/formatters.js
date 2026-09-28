export const formatPrice = (amount) => `৳ ${Number(amount).toLocaleString('bn-BD')}`;

export const formatNumber = (amount) => Number(amount || 0).toLocaleString('bn-BD');
