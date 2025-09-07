import { OrderItem, OrderTotals } from '../types/database';

export function computeOrderItemsTotals(items: Omit<OrderItem,'totalPrice'>[]): OrderItem[] {
  return items.map(i => ({ ...i, totalPrice: (i.unitPrice * i.quantity) - (i.discount || 0) }));
}

export function computeTotals(items: OrderItem[], taxRate = 0.0, shippingCost = 0): OrderTotals {
  const subtotal = items.reduce((a,i)=> a + i.totalPrice, 0);
  const discount = 0; // aggregate-level discount placeholder
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const grandTotal = subtotal - discount + tax + shippingCost;
  return {
    subtotal,
    discount,
    tax,
    shippingCost,
    grandTotal,
  } as any; // will add other fields when needed
}

export function generateOrderNumber(prefix = 'ORD', seq?: number) {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
  const random = seq ? String(seq).padStart(4,'0') : Math.floor(Math.random()*9000 + 1000);
  return `${prefix}-${stamp}-${random}`;
}
