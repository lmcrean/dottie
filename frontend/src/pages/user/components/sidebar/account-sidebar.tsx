import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, Key, LogOut } from 'lucide-react';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AccountSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links: SidebarLink[] = [
    {
      label: 'Profile',
      href: '/user/profile',
      icon: <UserCircle className="h-5 w-5 text-pink-700" />
    },
    {
      label: 'Password',
      href: '/user/password',
      icon: <Key className="h-5 w-5 text-pink-700" />
    },
    {
      label: 'Sign Out',
      href: '/auth/signout',
      icon: <LogOut className="h-5 w-5 text-pink-700" />
    }
  ];

  return (
    <aside className="w-full md:w-64 md:flex-none">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center rounded-md px-4 py-3 text-sm font-medium ${
              currentPath === link.href
                ? 'bg-pink-100 text-pink-700'
                : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600 dark:text-slate-200 dark:hover:text-pink-600'
            }`}
          >
            <span className="mr-3">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
