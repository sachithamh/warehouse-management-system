import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '../../../lib/firebase/firestore';
import { Order, OrderItem } from '../../../lib/types/database';
import { Timestamp } from 'firebase/firestore';
import { computeOrderItemsTotals, computeTotals, generateOrderNumber } from '../../../lib/utils/orderCalculations';

const COLLECTION = 'orders';

export async function GET() {
  try {
    const data = await firestoreService.list<Order>(COLLECTION);
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = Timestamp.now();
    const items: OrderItem[] = computeOrderItemsTotals(body.items) as any;
    const totals = computeTotals(items, body.taxRate || 0, body.shippingCost || 0);
    const order: Omit<Order,'id'> = {
      orderNumber: generateOrderNumber(),
      shopId: body.shopId,
      warehouseId: body.warehouseId,
      status: 'pending',
      items,
      totals: { ...totals, amountPaid: 0, amountDue: totals.grandTotal } as any,
      requestedDeliveryDate: body.requestedDeliveryDate || now,
      createdAt: now,
      updatedAt: now,
      notes: body.notes,
    };
    const id = await firestoreService.create<Order>(COLLECTION, order as any);
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create order' }, { status: 500 });
  }
}
