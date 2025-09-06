import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ClipboardList, Truck, Store, Warehouse, FileText, BarChart3 } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 size={16} /> },
  { label: 'Warehouses', href: '/warehouses', icon: <Warehouse size={16} /> },
  { label: 'Products', href: '/products', icon: <Package size={16} /> },
  { label: 'Inventory', href: '/inventory', icon: <ClipboardList size={16} /> },
  { label: 'Orders', href: '/orders', icon: <FileText size={16} /> },
  { label: 'Deliveries', href: '/deliveries', icon: <Truck size={16} /> },
  { label: 'Shops', href: '/shops', icon: <Store size={16} /> },
  { label: 'Billing', href: '/billing', icon: <FileText size={16} /> },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={`flex h-full flex-col border-r border-neutral-200 bg-white transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex items-center justify-between px-3 h-14 border-b border-neutral-200">
        <span className="text-sm font-semibold text-neutral-800">{collapsed ? 'W' : 'WMS Panel'}</span>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-neutral-500 hover:text-neutral-800 text-xs"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded px-2 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span className="text-neutral-500 group-hover:text-inherit">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-neutral-200 p-3 text-[10px] text-neutral-500">
        {!collapsed && <p>v{process.env.NEXT_PUBLIC_APP_VERSION}</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
