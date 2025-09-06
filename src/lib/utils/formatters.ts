export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const formatDate = (value: Date | number | string) => {
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString();
};
