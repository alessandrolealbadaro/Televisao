"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { TelevisaoAPI, type Televisao } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const cores = [
  "from-red-400 to-red-500",
  "from-blue-400 to-blue-500",
  "from-green-400 to-green-500",
  "from-purple-400 to-purple-500",
  "from-pink-400 to-pink-500",
  "from-yellow-400 to-yellow-500",
  "from-indigo-400 to-indigo-500",
  "from-teal-400 to-teal-500",
  "from-orange-400 to-orange-500",
  "from-cyan-400 to-cyan-500",
]

const emojisTV = ["📺", "🖥️", "📻", "🎬", "🎭", "🎪", "🎨", "🎯", "🎮", "📱"]

export default function TelevisoesPage() {
  const [televisoes, setTelevisoes] = useState<Televisao[]>([])
  const [televisoesFiltradas, setTelevisoesFiltradas] = useState<Televisao[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const carregarTelevisoes = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Carregando televisões...")

      const data = await TelevisaoAPI.listarTelevisoes()
      console.log("Dados recebidos:", data)

      setTelevisoes(data || [])
      setTelevisoesFiltradas(data || [])

      if (data && data.length > 0) {
        toast({
          title: "✅ Sucesso",
          description: `${data.length} televisão${data.length !== 1 ? "ões" : ""} carregada${data.length !== 1 ? "s" : ""}!`,
        })
      }
    } catch (error) {
      console.error("Erro ao carregar televisões:", error)
      setError("Não foi possível carregar as televisões")
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar as televisões. Verifique sua conexão.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const excluirTelevisao = async (televisao: Televisao) => {
    if (!televisao._id) {
      toast({
        title: "❌ Erro",
        description: "ID da televisão não encontrado.",
        variant: "destructive",
      })
      return
    }

    // Confirmação simples
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a televisão ${televisao.marca} ${televisao.modelo}?\n\nEsta ação não pode ser desfeita.`,
    )

    if (!confirmar) {
      return
    }

    try {
      console.log("=== INICIANDO EXCLUSÃO ===")
      console.log("Televisão a ser excluída:", televisao)
      console.log("ID:", televisao._id)

      setDeletingId(televisao._id)

      // Chamar a API para excluir
      await TelevisaoAPI.excluirTelevisao(televisao._id)
      console.log("✅ API retornou sucesso")

      // Atualizar os estados locais imediatamente
      const novaListaTelevisoes = televisoes.filter((tv) => tv._id !== televisao._id)

      console.log("📊 Lista antes:", televisoes.length)
      console.log("📊 Lista depois:", novaListaTelevisoes.length)

      setTelevisoes(novaListaTelevisoes)

      // Aplicar filtro se houver busca ativa
      if (busca.trim()) {
        const filtradas = novaListaTelevisoes.filter(
          (tv) =>
            tv.marca.toLowerCase().includes(busca.toLowerCase()) ||
            tv.modelo.toLowerCase().includes(busca.toLowerCase()),
        )
        setTelevisoesFiltradas(filtradas)
      } else {
        setTelevisoesFiltradas(novaListaTelevisoes)
      }

      toast({
        title: "✅ Sucesso",
        description: `Televisão ${televisao.marca} ${televisao.modelo} excluída com sucesso!`,
      })

      console.log("=== EXCLUSÃO CONCLUÍDA COM SUCESSO ===")
    } catch (error) {
      console.error("=== ERRO NA EXCLUSÃO ===")
      console.error("Erro completo:", error)

      toast({
        title: "❌ Erro",
        description: `Erro ao excluir televisão: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const filtrarTelevisoes = (termo: string) => {
    setBusca(termo)
    if (!termo.trim()) {
      setTelevisoesFiltradas(televisoes)
    } else {
      const filtradas = televisoes.filter(
        (tv) =>
          tv.marca.toLowerCase().includes(termo.toLowerCase()) || tv.modelo.toLowerCase().includes(termo.toLowerCase()),
      )
      setTelevisoesFiltradas(filtradas)
    }
  }

  const recarregarLista = () => {
    carregarTelevisoes()
  }

  useEffect(() => {
    carregarTelevisoes()
  }, [])

  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">📺</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Minhas Televisões
            </h1>
          </div>
        </header>
        <main className="flex-1 p-6 flex items-center justify-center">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-red-200">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Erro ao Carregar</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={recarregarLista}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
              >
                🔄 Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl">📺</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Minhas Televisões
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={recarregarLista}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "🔄"}
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
          >
            <Link href="/televisoes/nova">
              <Plus className="h-4 w-4 mr-2" />➕ Nova TV
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Barra de busca */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="🔍 Buscar por marca ou modelo..."
                  value={busca}
                  onChange={(e) => filtrarTelevisoes(e.target.value)}
                  className="pl-10 border-2 border-purple-200 focus:border-purple-400 bg-white/50"
                />
              </div>
              {busca && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Buscando por: "{busca}"</span>
                  <Button variant="ghost" size="sm" onClick={() => filtrarTelevisoes("")} className="h-6 px-2 text-xs">
                    ❌ Limpar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Card className="bg-white/80 backdrop-blur-sm p-8 shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                  <div className="text-2xl">📺</div>
                  <span className="text-lg font-medium text-gray-700">Carregando suas televisões...</span>
                </div>
              </Card>
            </div>
          ) : televisoesFiltradas.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-lg">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">{busca ? "🔍💫" : "📺💫"}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {busca ? "Nenhuma TV encontrada" : "Nenhuma televisão cadastrada"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {busca
                    ? `Não encontramos TVs com "${busca}". Tente outro termo de busca.`
                    : "Que tal começar adicionando sua primeira televisão ao sistema?"}
                </p>
                {!busca && (
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
                    size="lg"
                  >
                    <Link href="/televisoes/nova">
                      <Plus className="h-4 w-4 mr-2" />➕ Adicionar Primeira TV
                    </Link>
                  </Button>
                )}
                {busca && (
                  <Button
                    onClick={() => filtrarTelevisoes("")}
                    variant="outline"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    🔄 Ver Todas as TVs
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="mb-6 text-center">
                <Badge
                  variant="secondary"
                  className="text-lg px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-200 shadow-md"
                >
                  📊 Equipamentos Cadastrados: {televisoesFiltradas.length}
                  {busca && ` (filtrados de ${televisoes.length})`}
                </Badge>
              </div>

              {/* Grid de cards */}
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {televisoesFiltradas.map((televisao, index) => {
                  const corIndex = index % cores.length
                  const emojiIndex = index % emojisTV.length

                  return (
                    <Card
                      key={televisao._id || `tv-${index}`}
                      className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
                    >
                      {/* Header colorido */}
                      <div className={`bg-gradient-to-r ${cores[corIndex]} p-4 text-white relative`}>
                        <div className="flex items-center justify-between">
                          <div className="text-3xl animate-pulse">{emojisTV[emojiIndex]}</div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Botão Editar */}
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-white hover:bg-white/20 h-8 w-8 p-0"
                              title="Editar televisão"
                            >
                              <Link href={`/televisoes/editar/${televisao._id}`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>

                            {/* Botão Excluir - ATIVO */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => excluirTelevisao(televisao)}
                              disabled={deletingId === televisao._id}
                              className="text-white hover:bg-red-500/20 h-8 w-8 p-0 transition-colors"
                              title="Excluir televisão"
                            >
                              {deletingId === televisao._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 hover:text-red-200" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {/* Decoração */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                      </div>

                      {/* Conteúdo do card */}
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">🏷️ Marca</div>
                            <div className="font-bold text-lg text-gray-800 truncate" title={televisao.marca}>
                              {televisao.marca}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">📱 Modelo</div>
                            <div className="font-medium text-gray-700 truncate" title={televisao.modelo}>
                              {televisao.modelo}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">📡 Canais</div>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm">
                              {televisao.quantidadeCanais} canais
                            </Badge>
                          </div>
                        </div>

                        {/* Botões de ação no rodapé do card */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                          >
                            <Link href={`/televisoes/editar/${televisao._id}`}>
                              <Pencil className="h-3 w-3 mr-1" />
                              Editar
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => excluirTelevisao(televisao)}
                            disabled={deletingId === televisao._id}
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            {deletingId === televisao._id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Excluindo...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
