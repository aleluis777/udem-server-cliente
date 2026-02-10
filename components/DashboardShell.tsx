"use client";

import { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <Topbar />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className={`mt-14 p-8 transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-56"
        }`}
      >
        {children}
      </main>
    </>
  );
}
