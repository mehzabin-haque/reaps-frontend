// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard Home', href: '/', icon: <svg /* Dashboard Icon SVG */></svg> },
  { name: 'Upload Policy Document', href: '/upload', icon: <svg /* Upload Icon SVG */></svg> },
  { name: 'Analysis Reports', href: '/reports', icon: <svg /* Reports Icon SVG */></svg> },
  { name: 'Notifications', href: '/notifications', icon: <svg /* Notifications Icon SVG */></svg> },
  { name: 'Customization Settings', href: '/settings', icon: <svg /* Settings Icon SVG */></svg> },
  { name: 'AI Readiness Scorecard', href: '/scorecard', icon: <svg /* Scorecard Icon SVG */></svg> },
  { name: 'Interactive Dashboard', href: '/interactive', icon: <svg /* Interactive Dashboard Icon SVG */></svg> },
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <aside className="w-64 bg-primary text-white min-h-screen">
      <nav className="mt-10">
        {navItems.map((item) => (
          <Link href={item.href} key={item.name}>
            <a className={`flex items-center py-2.5 px-4 transition duration-200 hover:bg-secondary ${router.pathname === item.href ? 'bg-secondary' : ''}`}>
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </a>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
