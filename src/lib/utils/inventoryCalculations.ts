import { InventoryItem } from '../types/database';

export function computeAvailableQuantity(item: Pick<InventoryItem, 'quantity' | 'reservedQuantity'>) {
  return item.quantity - item.reservedQuantity;
}

export function isLowStock(item: InventoryItem) {
  return computeAvailableQuantity(item) <= item.reorderLevel;
}

export function reorderSuggestion(item: InventoryItem) {
  const available = computeAvailableQuantity(item);
  if (available > item.reorderLevel) return 0;
  const target = item.maxStockLevel - available;
  return target > 0 ? target : 0;
}
