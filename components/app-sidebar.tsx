"use client"

import { Home, Plus, List, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "🏠 Dashboard",
    url: "/",
    icon: Home,
    emoji: "🏠",
  },
  {
    title: "📺 Minhas TVs",
    url: "/televisoes",
    icon: List,
    emoji: "📺",
  },
  {
    title: "➕ Nova TV",
    url: "/televisoes/nova",
    icon: Plus,
    emoji: "➕",
  },
  {
    title: "📊 Estatísticas",
    url: "/estatisticas",
    icon: BarChart3,
    emoji: "📊",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r-2 border-purple-200">
      <SidebarHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="text-2xl">📺</div>
          <div>
            <div className="font-bold text-lg">TV Manager</div>
            <div className="text-purple-100 text-sm">Gerencie suas TVs</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-700 font-semibold">🚀 Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-purple-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-100 data-[active=true]:to-pink-100 data-[active=true]:text-purple-700 data-[active=true]:border-l-4 data-[active=true]:border-purple-500"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
