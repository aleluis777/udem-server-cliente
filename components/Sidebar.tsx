"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LogOut, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";

const navItems = [
  { label: "Usuarios", href: "/dashboard/users", icon: Users },
  { label: "Suscripciones", href: "/dashboard/subscriptions", icon: CreditCard },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 bg-[#111827] text-white flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div>
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-white/10"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-2 pb-3 border-t border-white/10">
        <button
          title="Salir"
          className={`flex items-center gap-3 px-3 py-2.5 mt-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Salir</span>}
        </button>
      </div>
    </aside>
  );
}
