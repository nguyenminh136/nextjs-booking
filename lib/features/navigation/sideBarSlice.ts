import { IconName } from "@/components/dynamic-icon";
import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: IconName;
  isActive?: boolean;
  items?: { title: string; url: string; isActive?: boolean }[];
}

export interface Team {
  name: string;
  logo: IconName;
  plan: string;
}

export interface SideBarSliceState {
  user: User;
  navMain: NavItem[];
  teams: Team[];
}

const initialState: SideBarSliceState = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatarUrl: "/avatars/shadcn.jpg"
  },
  teams: [
    {
      name: "Acme Inc",
      logo: "GalleryVerticalEnd",
      plan: "Enterprise"
    },
    {
      name: "Acme Corp.",
      logo: "AudioWaveform",
      plan: "Startup"
    },
    {
      name: "Evil Corp.",
      logo: "Command",
      plan: "Free"
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "LayoutDashboard",
      isActive: true
    },
    {
      title: "Studios",
      url: "/studios",
      icon: "SquareLibrary"
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: "CalendarDays"
    },
    {
      title: "Payments",
      url: "/payments",
      icon: "CreditCard"
    },
    {
      title: "Settings",
      url: "#",
      icon: "Settings2",
      items: [
        {
          title: "General",
          url: "#"
        },
        {
          title: "Team",
          url: "#"
        },
        {
          title: "Billing",
          url: "#"
        },
        {
          title: "Limits",
          url: "#"
        }
      ]
    }
  ]
};

export const sideBarSlice = createAppSlice({
  name: "sideBar",
  initialState,
  reducers: create => ({
    setUser: create.reducer((state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }),
    setActive: create.reducer((state, action: PayloadAction<string>) => {
      state.navMain.forEach(item => {
        item.isActive = item.title === action.payload;
        if (item.items) {
          item.items.forEach(subItem => {
            subItem.isActive = subItem.title === action.payload;
            if (subItem.isActive) item.isActive = true;
          });
        }
      });
    })
  }),
  selectors: {
    selectUser: state => state.user,
    selectNavMain: state => state.navMain,
    selectTeams: state => state.teams
  }
});

export const { setUser, setActive } = sideBarSlice.actions;

export const { selectUser, selectNavMain, selectTeams } =
  sideBarSlice.selectors;
