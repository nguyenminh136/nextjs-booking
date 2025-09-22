import { inter, spaceGrotesk } from "./fonts";
import { ThemeProvider } from "@/context/theme-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
// import { NavigationHeader } from "@/components/header";

import "./globals.css";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {/* <NavigationHeader /> */}
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              <div className="flex h-screen flex-col md:overflow-hidden">
                <div className="flex-grow overflow-y-auto">{children}</div>
              </div>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
