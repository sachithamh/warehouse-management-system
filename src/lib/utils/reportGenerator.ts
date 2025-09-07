import { InventoryItem, Product, Warehouse } from '../types/database';

export interface InventoryAggregate {
  warehouseId: string;
  totalQuantity: number;
  totalAvailable: number;
  totalReserved: number;
  lowStockCount: number;
}

export interface ProductStockValue {
  productId: string;
  quantity: number;
  available: number;
  reserved: number;
  reorderLevel: number;
}

export interface StockValueResult {
  productId: string;
  totalQuantity: number;
  totalAvailable: number;
  totalReserved: number;
}

export function aggregateByWarehouse(items: InventoryItem[]): InventoryAggregate[] {
  const map = new Map<string, InventoryAggregate>();
  items.forEach(i => {
    const existing = map.get(i.warehouseId) || { warehouseId: i.warehouseId, totalQuantity:0, totalAvailable:0, totalReserved:0, lowStockCount:0 };
    existing.totalQuantity += i.quantity;
    existing.totalAvailable += i.availableQuantity;
    existing.totalReserved += i.reservedQuantity;
    if (i.availableQuantity <= i.reorderLevel) existing.lowStockCount += 1;
    map.set(i.warehouseId, existing);
  });
  return Array.from(map.values());
}

export function aggregateByProduct(items: InventoryItem[]): StockValueResult[] {
  const map = new Map<string, StockValueResult>();
  items.forEach(i => {
    const existing = map.get(i.productId) || { productId: i.productId, totalQuantity:0, totalAvailable:0, totalReserved:0 };
    existing.totalQuantity += i.quantity;
    existing.totalAvailable += i.availableQuantity;
    existing.totalReserved += i.reservedQuantity;
    map.set(i.productId, existing);
  });
  return Array.from(map.values());
}

export function topLowStock(items: InventoryItem[], limit = 10) {
  return [...items]
    .filter(i => i.availableQuantity <= i.reorderLevel)
    .sort((a,b) => (a.availableQuantity - a.reorderLevel) - (b.availableQuantity - b.reorderLevel))
    .slice(0, limit);
}

export function inventoryHealthScore(items: InventoryItem[]) {
  if (!items.length) return 100;
  const low = items.filter(i => i.availableQuantity <= i.reorderLevel).length;
  const ratio = low / items.length;
  return Math.max(0, Math.round(100 - ratio * 100));
}

export interface InventoryReportSummary {
  totalSKUs: number;
  totalQuantity: number;
  totalAvailable: number;
  totalReserved: number;
  lowStockItems: number;
  healthScore: number;
}

export function buildSummary(items: InventoryItem[]): InventoryReportSummary {
  return {
    totalSKUs: items.length,
    totalQuantity: items.reduce((a,i)=>a+i.quantity,0),
    totalAvailable: items.reduce((a,i)=>a+i.availableQuantity,0),
    totalReserved: items.reduce((a,i)=>a+i.reservedQuantity,0),
    lowStockItems: items.filter(i=> i.availableQuantity <= i.reorderLevel).length,
    healthScore: inventoryHealthScore(items),
  };
}

export function enrichWarehouseAggregates(aggs: InventoryAggregate[], warehouses: Warehouse[]) {
  const map = new Map(warehouses.map(w => [w.id, w] as const));
  return aggs.map(a => ({ ...a, warehouseName: map.get(a.warehouseId)?.name || a.warehouseId }));
}

export function enrichProductAggregates(aggs: StockValueResult[], products: Product[]) {
  const map = new Map(products.map(p => [p.id, p] as const));
  return aggs.map(a => ({ ...a, productName: map.get(a.productId)?.name || a.productId }));
}
