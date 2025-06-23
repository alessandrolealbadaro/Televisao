import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "📺 TV Dashboard",
  description: "Sistema colorido de gerenciamento de televisões",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
