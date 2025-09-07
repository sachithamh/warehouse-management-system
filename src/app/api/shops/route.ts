import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '../../../lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Shop } from '../../../lib/types/database';

const COLLECTION = 'shops';

export async function GET() {
  try {
    const data = await firestoreService.list<Shop>(COLLECTION);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = Timestamp.now();
    const id = await firestoreService.create<Shop>(COLLECTION, { ...body, createdAt: now, updatedAt: now });
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}
