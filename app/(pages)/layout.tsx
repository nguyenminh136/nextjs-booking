import {
  SidebarProvider
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SideBarBreadcrumb } from "@/components/sidebar-breadcrumb";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SideBarBreadcrumb>{children}</SideBarBreadcrumb>
    </SidebarProvider>
  );
}
