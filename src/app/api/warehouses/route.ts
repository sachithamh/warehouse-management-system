import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '../../../lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Warehouse } from '../../../lib/types/database';

const COLLECTION = 'warehouses';

export async function GET() {
  try {
    const data = await firestoreService.list<Warehouse>(COLLECTION);
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch warehouses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = Timestamp.now();
    const data: Omit<Warehouse, 'id'> = {
      name: body.name,
      manager: body.manager,
      isActive: body.isActive ?? true,
      address: body.address,
      capacity: body.capacity,
      createdAt: now,
      updatedAt: now,
    };
    const id = await firestoreService.create<Warehouse>(COLLECTION, data as any);
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create warehouse' }, { status: 500 });
  }
}
