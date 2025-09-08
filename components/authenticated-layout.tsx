"use client";

import { TopNav } from "@/components/top-nav";
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import type { ReactNode } from "react";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
