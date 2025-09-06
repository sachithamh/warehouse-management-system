"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavigationProps {
  items: { label: string; href: string }[];
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ items, className }) => {
  const pathname = usePathname();
  return (
    <div className={className}>
      <ul className="flex items-center gap-4 text-sm">
        {items.map((i) => {
          const active = pathname.startsWith(i.href);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`font-medium transition-colors ${active ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}
              >
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navigation;
