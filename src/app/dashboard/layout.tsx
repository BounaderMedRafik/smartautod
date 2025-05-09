import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { auth } from "@/lib/auth";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { SessionProvider } from "next-auth/react";
import NotAuthorized from "@/components/NotAuthorized";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "The dashboard for SmartAuto",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session) {
    return (
      <>
        <SessionProvider session={session}>
          <DashboardTopBar />

          <SidebarProvider>
            <AppSidebar />
            <main className="w-full pb-4">
              <SidebarTrigger />
              {children}
              <Toaster />
            </main>
          </SidebarProvider>
        </SessionProvider>
      </>
    );
  }
  return (
    <html lang="en">
      <body className="antialiased">
        <main>
          <NotAuthorized />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
