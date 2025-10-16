"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/hooks";
import {
  selectNavMain,
  selectTeams,
  selectUser
} from "@/lib/features/navigation/sideBarSlice";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = useAppSelector(selectUser);
  const navMain = useAppSelector(selectNavMain);
  const teams = useAppSelector(selectTeams);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user || {}} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
