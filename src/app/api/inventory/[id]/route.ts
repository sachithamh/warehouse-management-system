import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '../../../../lib/firebase/firestore';
import { InventoryItem } from '../../../../lib/types/database';
import { Timestamp } from 'firebase/firestore';

const COLLECTION = 'inventory';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doc = await firestoreService.get<InventoryItem>(COLLECTION, params.id);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: doc });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await firestoreService.update<InventoryItem>(COLLECTION, params.id, { ...body, updatedAt: Timestamp.now() });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await firestoreService.remove(COLLECTION, params.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete item' }, { status: 500 });
  }
}
