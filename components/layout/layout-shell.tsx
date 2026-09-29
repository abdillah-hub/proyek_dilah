"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <main className="min-h-full flex-1">{children}</main>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-2 border-b bg-white flex items-center">
          <SidebarTrigger />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
