"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle-button";
import { selectNavMain } from "@/lib/features/navigation/sideBarSlice";
import { useAppSelector } from "@/lib/hooks";

export function SideBarBreadcrumb({ children }: { children: React.ReactNode }) {
  const navMain = useAppSelector(selectNavMain);
  const breadcrumb: {
    level1: { url: string; title: string };
    level2: string;
  } = {
    level1: { url: "", title: "" },
    level2: ""
  };
  navMain.forEach(item => {
    if (item.isActive) {
      breadcrumb.level1.url = item.url;
      breadcrumb.level1.title = item.title;
    }
    if (item.items) {
      item.items.forEach(subitem => {
        if (subitem.isActive) breadcrumb.level2 = subitem.title;
      });
    }
  });
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={breadcrumb.level1.url}>
                  {breadcrumb.level1.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumb.level2 && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumb.level2}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4 lg:px-6">
          <ModeToggle />
        </div>
      </header>
      <div className="px-4 lg:px-6">{children}</div>
    </SidebarInset>
  );
}
