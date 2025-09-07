import { NextRequest, NextResponse } from 'next/server';
import { firestoreService } from '../../../lib/firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { Product } from '../../../lib/types/database';

const COLLECTION = 'products';

export async function GET() {
  try {
    const data = await firestoreService.list<Product>(COLLECTION);
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = Timestamp.now();
    const data: Omit<Product, 'id'> = {
      sku: body.sku,
      name: body.name,
      description: body.description,
      category: body.category,
      subcategory: body.subcategory || '',
      brand: body.brand,
      dimensions: body.dimensions,
      images: body.images || [],
      basePrice: body.basePrice,
      minOrderQuantity: body.minOrderQuantity,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    const id = await firestoreService.create<Product>(COLLECTION, data as any);
    return NextResponse.json({ id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create product' }, { status: 500 });
  }
}
