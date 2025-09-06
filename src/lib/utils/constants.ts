export const COLLECTIONS = {
  USERS: 'users',
  WAREHOUSES: 'warehouses',
  PRODUCTS: 'products',
  INVENTORY: 'inventory',
  SHOPS: 'shops',
  VEHICLES: 'vehicles',
  ORDERS: 'orders',
  DELIVERIES: 'deliveries',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
} as const;

export const APP = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'WMS',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1',
};
