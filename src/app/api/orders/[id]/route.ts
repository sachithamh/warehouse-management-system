import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '../../../../lib/firebase/firestore';
import { Order } from '../../../../lib/types/database';
import { Timestamp } from 'firebase/firestore';

const COLLECTION = 'orders';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doc = await firestoreService.get<Order>(COLLECTION, params.id);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: doc });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await firestoreService.update<Order>(COLLECTION, params.id, { ...body, updatedAt: Timestamp.now() });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await firestoreService.remove(COLLECTION, params.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete order' }, { status: 500 });
  }
}
