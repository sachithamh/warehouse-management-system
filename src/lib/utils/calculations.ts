// Placeholder calculation utilities to be expanded per feature area
export const calculateOrderSubtotal = (items: { quantity: number; unitPrice: number }[]) =>
  items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
