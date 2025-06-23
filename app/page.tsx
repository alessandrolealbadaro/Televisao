"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TelevisaoAPI, type Televisao } from "@/lib/api"

export default function HomePage() {
  const [televisoes, setTelevisoes] = useState<Televisao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarTelevisoes = async () => {
      try {
        const data = await TelevisaoAPI.listarTelevisoes()
        setTelevisoes(data)
      } catch (error) {
        console.error("Erro ao carregar televisões:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarTelevisoes()
  }, [])

  const marcasUnicas = new Set(televisoes.map((tv) => tv.marca)).size
  const totalCanais = televisoes.reduce((acc, tv) => acc + tv.quantidadeCanais, 0)
  const mediaCanais = televisoes.length > 0 ? Math.round(totalCanais / televisoes.length) : 0

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard Principal
          </h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header com boas-vindas */}
          <div className="mb-8 text-center">
            <div className="text-6xl mb-4">📺✨</div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Bem-vindo ao TV Manager!
            </h2>
            <p className="text-gray-600 text-lg">
              Gerencie seu catálogo de televisões de forma colorida e divertida 🎨
            </p>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Total de TVs</CardTitle>
                <div className="text-2xl">📺</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "..." : televisoes.length}</div>
                <p className="text-xs opacity-80 mt-1">Televisões cadastradas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Marcas Diferentes</CardTitle>
                <div className="text-2xl">🏷️</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "..." : marcasUnicas}</div>
                <p className="text-xs opacity-80 mt-1">Variedade de marcas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Total de Canais</CardTitle>
                <div className="text-2xl">📡</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "..." : totalCanais.toLocaleString()}</div>
                <p className="text-xs opacity-80 mt-1">Canais disponíveis</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Média de Canais</CardTitle>
                <div className="text-2xl">📊</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "..." : mediaCanais}</div>
                <p className="text-xs opacity-80 mt-1">Canais por TV</p>
              </CardContent>
            </Card>
          </div>

          {/* Ações rápidas */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-pink-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="text-4xl mb-2">🚀</div>
                <CardTitle className="text-purple-700">Ações Rápidas</CardTitle>
                <CardDescription>Comece a gerenciar suas televisões agora mesmo!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
                  size="lg"
                >
                  <Link href="/televisoes/nova">➕ Adicionar Nova TV</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                  size="lg"
                >
                  <Link href="/televisoes">📺 Ver Todas as TVs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="text-4xl mb-2">💡</div>
                <CardTitle className="text-blue-700">Dicas do Sistema</CardTitle>
                <CardDescription>Aproveite ao máximo o TV Manager</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>Organize suas TVs por marca e modelo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span>Acompanhe estatísticas em tempo real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔍</span>
                    <span>Use filtros para encontrar TVs rapidamente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    <span>Interface colorida e intuitiva</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview das últimas TVs */}
          {televisoes.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <CardTitle className="text-gray-800">Últimas TVs Cadastradas</CardTitle>
                </div>
                <CardDescription>Suas televisões mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {televisoes.slice(-3).map((tv, index) => (
                    <div
                      key={tv._id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="text-2xl mb-2">📺</div>
                      <div className="font-semibold text-gray-800">{tv.marca}</div>
                      <div className="text-sm text-gray-600">{tv.modelo}</div>
                      <div className="text-xs text-purple-600 mt-1">📡 {tv.quantidadeCanais} canais</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
