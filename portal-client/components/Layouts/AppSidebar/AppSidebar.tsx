"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./TeamSwitcher"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"

// This is sample data.
const data = {
  user: {
    name: "Test User",
    email: "earlbryanburaay@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Pod A",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Pod B",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Pod C",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Team Management",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Manage Pods",
          url: "#",
        },
        {
          title: "Manage Pod Heads",
          url: "#",
        },
        {
          title: "Manage Editors",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
