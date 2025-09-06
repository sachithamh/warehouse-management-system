# Warehouse Management System (WMS) - Technical Documentation

## 🚀 Project Overview

A comprehensive Warehouse Management System with integrated delivery tracking and billing capabilities for managing inventory, deliveries to retail shops, and automated invoicing.

### Core Objectives
- Centralized warehouse inventory management
- Real-time stock tracking and alerts
- Automated delivery scheduling and tracking
- Shop billing and invoice generation
- Fleet and delivery agent management
- Comprehensive reporting and analytics

---

## 🛠️ Technology Stack

### Frontend & Backend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules / Tailwind CSS
- **Build Tool**: Vite (for development server)
- **Package Manager**: Yarn

### Database & Services
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Real-time Updates**: Firestore Real-time Listeners

### Additional Tools
- **State Management**: Zustand / React Context
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **PDF Generation**: jsPDF / React-PDF
- **Charts**: Chart.js / Recharts

---

## 📊 System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │────│   Next.js App   │────│   Firebase      │
│   (Browser)     │    │   (Frontend)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              │                        ├─ Firestore DB
                              │                        ├─ Firebase Auth
                              │                        └─ Firebase Storage
                              │
                       ┌─────────────────┐
                       │   External APIs │
                       │   (Optional)    │
                       └─────────────────┘
```

---

## 🗄️ Database Schema (Firestore Collections)

### 1. Users Collection (`users`)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'warehouse_manager' | 'delivery_agent' | 'shop_owner';
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  permissions: string[];
  assignedWarehouses?: string[]; // for warehouse managers
  assignedVehicles?: string[]; // for delivery agents
}
```

### 2. Warehouses Collection (`warehouses`)
```typescript
interface Warehouse {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  manager: string; // user ID
  capacity: {
    totalSpace: number; // in cubic meters
    usedSpace: number;
    availableSpace: number;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3. Products Collection (`products`)
```typescript
interface Product {
  id: string;
  sku: string; // unique stock keeping unit
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  images: string[]; // Firebase Storage URLs
  basePrice: number;
  minOrderQuantity: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4. Inventory Collection (`inventory`)
```typescript
interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reservedQuantity: number; // allocated for pending orders
  availableQuantity: number; // quantity - reservedQuantity
  location: {
    zone: string;
    rack: string;
    shelf: string;
  };
  batchNumber?: string;
  expiryDate?: Timestamp;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number; // minimum stock level
  maxStockLevel: number;
  lastRestocked: Timestamp;
  updatedAt: Timestamp;
}
```

### 5. Shops Collection (`shops`)
```typescript
interface Shop {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  businessLicense: string;
  taxId: string;
  creditLimit: number;
  creditUsed: number;
  paymentTerms: number; // days
  preferredDeliveryDays: string[]; // ['monday', 'wednesday', 'friday']
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 6. Vehicles Collection (`vehicles`)
```typescript
interface Vehicle {
  id: string;
  licensePlate: string;
  type: 'truck' | 'van' | 'motorcycle' | 'bicycle';
  capacity: {
    weight: number; // in kg
    volume: number; // in cubic meters
  };
  driverId: string; // user ID
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  maintenanceSchedule: {
    lastService: Timestamp;
    nextService: Timestamp;
    mileage: number;
  };
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 7. Orders Collection (`orders`)
```typescript
interface Order {
  id: string;
  orderNumber: string; // unique order number
  shopId: string;
  warehouseId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    shippingCost: number;
    grandTotal: number;
  };
  requestedDeliveryDate: Timestamp;
  scheduledDeliveryDate?: Timestamp;
  actualDeliveryDate?: Timestamp;
  assignedVehicle?: string;
  assignedDriver?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}
```

### 8. Deliveries Collection (`deliveries`)
```typescript
interface Delivery {
  id: string;
  deliveryNumber: string;
  orderId: string;
  vehicleId: string;
  driverId: string;
  shopId: string;
  warehouseId: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  scheduledTime: Timestamp;
  departureTime?: Timestamp;
  arrivalTime?: Timestamp;
  deliveryTime?: Timestamp;
  route: {
    distance: number; // in km
    estimatedDuration: number; // in minutes
    actualDuration?: number;
  };
  deliveryProof?: {
    signature: string; // base64 image
    photos: string[]; // Firebase Storage URLs
    recipientName: string;
  };
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 9. Invoices Collection (`invoices`)
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  shopId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Timestamp;
  dueDate: Timestamp;
  paidDate?: Timestamp;
  items: InvoiceItem[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
    amountPaid: number;
    amountDue: number;
  };
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface InvoiceItem {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
}
```

### 10. Payments Collection (`payments`)
```typescript
interface Payment {
  id: string;
  invoiceId: string;
  shopId: string;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'check' | 'card' | 'online';
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  paidDate: Timestamp;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 🏗️ Project Structure

```
warehouse-management-system/
├── public/
│   ├── icons/
│   └── images/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── warehouses/
│   │   ├── inventory/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── deliveries/
│   │   ├── shops/
│   │   ├── billing/
│   │   ├── vehicles/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Loading/
│   │   │   └── Chart/
│   │   ├── forms/                    # Form components
│   │   │   ├── ProductForm/
│   │   │   ├── OrderForm/
│   │   │   ├── ShopForm/
│   │   │   └── DeliveryForm/
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Navigation/
│   │   │   └── Footer/
│   │   └── features/                 # Feature-specific components
│   │       ├── inventory/
│   │       ├── orders/
│   │       ├── deliveries/
│   │       └── billing/
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── storage.ts
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useFirestore.ts
│   │   │   ├── useInventory.ts
│   │   │   └── useOrders.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── calculations.ts
│   │   │   └── constants.ts
│   │   └── types/
│   │       ├── database.ts
│   │       ├── api.ts
│   │       └── components.ts
│   ├── store/                        # State management
│   │   ├── authStore.ts
│   │   ├── inventoryStore.ts
│   │   ├── orderStore.ts
│   │   └── globalStore.ts
│   └── styles/
│       ├── globals.css
│       ├── components.css
│       └── utils.css
├── package.json
├── tsconfig.json
├── next.config.js
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🔧 Core Features & Implementation

### 1. Authentication & Authorization
- **Firebase Auth integration**
- **Role-based access control**
- **Protected routes middleware**
- **Permission-based UI rendering**

### 2. Warehouse Management
- **Multi-warehouse support**
- **Warehouse capacity tracking**
- **Location-based inventory management**
- **Staff assignment per warehouse**

### 3. Inventory Management
- **Real-time stock levels**
- **Low stock alerts**
- **Batch tracking**
- **Expiry date management**
- **Stock movement history**
- **Automated reorder suggestions**

### 4. Product Management
- **Product catalog with images**
- **SKU generation**
- **Category management**
- **Pricing management**
- **Product variants support**

### 5. Order Management
- **Order creation and processing**
- **Order status tracking**
- **Inventory reservation**
- **Order fulfillment workflow**
- **Order history and analytics**

### 6. Delivery Management
- **Route optimization**
- **Delivery scheduling**
- **Real-time tracking**
- **Proof of delivery**
- **Delivery performance metrics**

### 7. Vehicle & Fleet Management
- **Vehicle registration**
- **Driver assignment**
- **Maintenance scheduling**
- **Vehicle utilization tracking**
- **Route history**

### 8. Shop Management
- **Shop registration**
- **Credit limit management**
- **Order history per shop**
- **Delivery preferences**
- **Shop performance analytics**

### 9. Billing & Invoicing
- **Automated invoice generation**
- **Payment tracking**
- **Credit management**
- **Tax calculations**
- **Financial reporting**

### 10. Reporting & Analytics
- **Inventory reports**
- **Sales analytics**
- **Delivery performance**
- **Financial summaries**
- **Custom report builder**

---

## 📱 User Interface Modules

### 1. Dashboard
- **KPI overview cards**
- **Recent activity feed**
- **Low stock alerts**
- **Pending deliveries**
- **Revenue charts**

### 2. Inventory Module
- **Stock level overview**
- **Product search and filtering**
- **Stock adjustment forms**
- **Reorder management**
- **Movement history**

### 3. Orders Module
- **Order creation wizard**
- **Order queue management**
- **Order status pipeline**
- **Order details view**
- **Bulk operations**

### 4. Delivery Module
- **Delivery calendar**
- **Route planning**
- **Driver assignment**
- **Delivery tracking map**
- **Performance metrics**

### 5. Billing Module
- **Invoice generator**
- **Payment tracking**
- **Credit management**
- **Financial reports**
- **Payment reminders**

---

## 🔐 Security Implementation

### Authentication
```typescript
// lib/firebase/auth.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export const authService = {
  signIn: async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },
  
  signUp: async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  },
  
  signOut: async () => {
    return await signOut(auth);
  }
};
```

### Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Warehouse access based on role
    match /warehouses/{warehouseId} {
      allow read, write: if request.auth != null && 
        (resource.data.manager == request.auth.uid || 
         request.auth.token.role == 'admin');
    }
    
    // Inventory management
    match /inventory/{inventoryId} {
      allow read, write: if request.auth != null && 
        request.auth.token.role in ['admin', 'warehouse_manager'];
    }
    
    // Orders - shops can view their orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.shopId == request.auth.uid || 
         request.auth.token.role in ['admin', 'warehouse_manager']);
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'warehouse_manager'];
    }
  }
}
```

---

## 🚦 API Routes & Endpoints

### Next.js API Routes Structure
```
src/app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── warehouses/
│   ├── route.ts
│   └── [id]/route.ts
├── inventory/
│   ├── route.ts
│   ├── low-stock/route.ts
│   └── [id]/route.ts
├── products/
│   ├── route.ts
│   └── [id]/route.ts
├── orders/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── [id]/status/route.ts
├── deliveries/
│   ├── route.ts
│   ├── schedule/route.ts
│   └── [id]/route.ts
├── shops/
│   ├── route.ts
│   └── [id]/route.ts
├── billing/
│   ├── invoices/route.ts
│   ├── payments/route.ts
│   └── reports/route.ts
└── reports/
    ├── inventory/route.ts
    ├── sales/route.ts
    └── delivery/route.ts
```

---

## 📊 Real-time Features

### Firestore Listeners Implementation
```typescript
// lib/hooks/useRealTimeInventory.ts
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';

export const useRealTimeInventory = (warehouseId: string) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'inventory'), 
      where('warehouseId', '==', warehouseId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InventoryItem[];
      
      setInventory(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [warehouseId]);

  return { inventory, loading };
};
```

---

## 🔄 State Management

### Zustand Store Example
```typescript
// store/orderStore.ts
import { create } from 'zustand';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    // Implement Firestore query
    set({ loading: false });
  },

  createOrder: async (orderData) => {
    // Implement order creation logic
  },

  updateOrderStatus: async (orderId, status) => {
    // Implement status update logic
  }
}));
```

---

## 📦 Development Setup

### Installation
```bash
# Clone repository
git clone <repository-url>
cd warehouse-management-system

# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables (.env.local)
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# App Configuration
NEXT_PUBLIC_APP_NAME=WMS Pro
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Firebase Configuration
```typescript
// lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## 🧪 Testing Strategy

### Unit Testing
- **Component testing with React Testing Library**
- **Utility function testing**
- **Custom hooks testing**

### Integration Testing
- **API route testing**
- **Database operations testing**
- **Authentication flow testing**

### E2E Testing
- **User workflow testing**
- **Cross-browser compatibility**
- **Mobile responsiveness**

---

## 🚀 Deployment

### Build Process
```bash
# Build for production
yarn build

# Start production server
yarn start
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Firebase Hosting**
- **Netlify**
- **AWS Amplify**

---

## 📈 Performance Optimization

### Code Optimization
- **Tree shaking and code splitting**
- **Lazy loading components**
- **Image optimization**
- **Bundle analysis**

### Database Optimization
- **Firestore indexing**
- **Query optimization**
- **Data pagination**
- **Caching strategies**

---

## 🔍 Monitoring & Analytics

### Error Tracking
- **Sentry integration**
- **Error boundaries**
- **Performance monitoring**

### User Analytics
- **Google Analytics**
- **User behavior tracking**
- **Performance metrics**

---

## 📚 Additional Features (Phase 2)

### Advanced Features
- **Barcode scanning**
- **Mobile app (React Native)**
- **Advanced reporting**
- **Integration APIs**
- **Multi-tenant support**
- **Automated ordering**
- **Demand forecasting**
- **GPS tracking**
- **Voice commands**
- **Augmented reality for warehouse navigation**

---

## 🤝 Contributing

### Development Guidelines
- **TypeScript strict mode**
- **ESLint configuration**
- **Prettier code formatting**
- **Conventional commits**
- **Code review process**

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/inventory-management
git add .
git commit -m "feat: add inventory management module"
git push origin feature/inventory-management
```

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

For technical support and questions, please contact the development team or create an issue in the project repository.

---

*This documentation serves as a comprehensive guide for developing the Warehouse Management System. Keep it updated as the project evolves.*