"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import TickerBar from "@/components/TickerBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950">
      {/* Ticker bar at top */}
      <TickerBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 md:hidden">
              <DashboardSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile header with hamburger */}
          <div className="md:hidden flex items-center px-4 py-3 border-b border-gray-800">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
