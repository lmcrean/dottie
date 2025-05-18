import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const menuItems = [
  {
    title: 'Account',
    href: '/user/profile'
  },
  {
    title: 'Privacy',
    href: '/user/privacy'
  },
  {
    title: 'Notifications',
    href: '/user/notifications'
  }
];

const AccountSidebar = () => {
  const location = useLocation();

  return (
    <nav className="w-full rounded-lg border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-gray-900 md:w-64">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-slate-100 dark:hover:bg-gray-800',
              location.pathname === item.href &&
                'bg-pink-50 text-pink-700 dark:bg-pink-900 dark:text-pink-200'
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AccountSidebar;
