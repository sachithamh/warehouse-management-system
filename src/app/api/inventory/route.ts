import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '../../../lib/firebase/firestore';
import { InventoryItem } from '../../../lib/types/database';
import { computeAvailableQuantity } from '../../../lib/utils/inventoryCalculations';
import { Timestamp } from 'firebase/firestore';

const COLLECTION = 'inventory';

export async function GET() {
  try {
    const data = await firestoreService.list<InventoryItem>(COLLECTION);
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = Timestamp.now();
    const availableQuantity = computeAvailableQuantity({ quantity: body.quantity, reservedQuantity: body.reservedQuantity });
    const item: Omit<InventoryItem, 'id'> = {
      productId: body.productId,
      warehouseId: body.warehouseId,
      quantity: body.quantity,
      reservedQuantity: body.reservedQuantity || 0,
      availableQuantity,
      location: body.location,
      batchNumber: body.batchNumber,
      expiryDate: body.expiryDate,
      costPrice: body.costPrice,
      sellingPrice: body.sellingPrice,
      reorderLevel: body.reorderLevel,
      maxStockLevel: body.maxStockLevel,
      lastRestocked: now,
      updatedAt: now,
    };
    const id = await firestoreService.create<InventoryItem>(COLLECTION, item as any);
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create inventory item' }, { status: 500 });
  }
}
