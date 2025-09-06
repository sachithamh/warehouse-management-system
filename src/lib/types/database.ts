// Central database domain models derived from project documentation
// These interfaces intentionally mirror Firestore documents; all date fields use Firebase Timestamp
// unless explicitly transformed in the UI layer.

import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'warehouse_manager' | 'delivery_agent' | 'shop_owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  permissions: string[];
  assignedWarehouses?: string[];
  assignedVehicles?: string[];
}

export interface WarehouseAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface WarehouseCapacity {
  totalSpace: number;
  usedSpace: number;
  availableSpace: number; // derived or stored snapshot
}

export interface Warehouse {
  id: string;
  name: string;
  address: WarehouseAddress;
  manager: string; // user ID
  capacity: WarehouseCapacity;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  dimensions: ProductDimensions;
  images: string[]; // Firebase Storage URLs
  basePrice: number;
  minOrderQuantity: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface InventoryLocation {
  zone: string;
  rack: string;
  shelf: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number; // quantity - reservedQuantity
  location: InventoryLocation;
  batchNumber?: string;
  expiryDate?: Timestamp;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  maxStockLevel: number;
  lastRestocked: Timestamp;
  updatedAt: Timestamp;
}

export interface ShopAddress extends WarehouseAddress {}

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: ShopAddress;
  businessLicense: string;
  taxId: string;
  creditLimit: number;
  creditUsed: number;
  paymentTerms: number; // days
  preferredDeliveryDays: string[]; // e.g. ['monday','wednesday']
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type VehicleType = 'truck' | 'van' | 'motorcycle' | 'bicycle';

export interface VehicleMaintenance {
  lastService: Timestamp;
  nextService: Timestamp;
  mileage: number;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: VehicleType;
  capacity: { weight: number; volume: number };
  driverId: string; // user ID
  isAvailable: boolean;
  currentLocation?: { lat: number; lng: number; address: string };
  maintenanceSchedule: VehicleMaintenance;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  grandTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  shopId: string;
  warehouseId: string;
  status: OrderStatus;
  items: OrderItem[];
  totals: OrderTotals;
  requestedDeliveryDate: Timestamp;
  scheduledDeliveryDate?: Timestamp;
  actualDeliveryDate?: Timestamp;
  assignedVehicle?: string;
  assignedDriver?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DeliveryStatus = 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';

export interface DeliveryRouteMeta {
  distance: number; // km
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
}

export interface DeliveryProof {
  signature: string; // base64 image
  photos: string[];
  recipientName: string;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  orderId: string;
  vehicleId: string;
  driverId: string;
  shopId: string;
  warehouseId: string;
  status: DeliveryStatus;
  scheduledTime: Timestamp;
  departureTime?: Timestamp;
  arrivalTime?: Timestamp;
  deliveryTime?: Timestamp;
  route: DeliveryRouteMeta;
  deliveryProof?: DeliveryProof;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number; // percent
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  amountPaid: number;
  amountDue: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  shopId: string;
  status: InvoiceStatus;
  issueDate: Timestamp;
  dueDate: Timestamp;
  paidDate?: Timestamp;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'card' | 'online';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Payment {
  id: string;
  invoiceId: string;
  shopId: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  status: PaymentStatus;
  paidDate: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Utility generic for Firestore documents when mapping (id is always string)
export type WithId<T> = T & { id: string };
