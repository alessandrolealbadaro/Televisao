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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const cores = [
  "from-red-400 to-red-500",
  "from-blue-400 to-blue-500",
  "from-green-400 to-green-500",
  "from-purple-400 to-purple-500",
  "from-pink-400 to-pink-500",
  "from-yellow-400 to-yellow-500",
  "from-indigo-400 to-indigo-500",
  "from-teal-400 to-teal-500",
]

const emojisTV = ["📺", "🖥️", "📻", "🎬", "🎭", "🎪", "🎨", "🎯"]

export default function TelevisoesPage() {
  const [televisoes, setTelevisoes] = useState<Televisao[]>([])
  const [televisoesFiltradas, setTelevisoesFiltradas] = useState<Televisao[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busca, setBusca] = useState("")
  const { toast } = useToast()

  const carregarTelevisoes = async () => {
    try {
      setLoading(true)
      const data = await TelevisaoAPI.listarTelevisoes()
      setTelevisoes(data)
      setTelevisoesFiltradas(data)
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar as televisões.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const excluirTelevisao = async (id: string) => {
    try {
      setDeletingId(id)
      await TelevisaoAPI.excluirTelevisao(id)
      setTelevisoes((prev) => prev.filter((tv) => tv._id !== id))
      setTelevisoesFiltradas((prev) => prev.filter((tv) => tv._id !== id))
      toast({
        title: "✅ Sucesso",
        description: "Televisão excluída com sucesso!",
      })
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível excluir a televisão.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const filtrarTelevisoes = (termo: string) => {
    setBusca(termo)
    if (!termo) {
      setTelevisoesFiltradas(televisoes)
    } else {
      const filtradas = televisoes.filter(
        (tv) =>
          tv.marca.toLowerCase().includes(termo.toLowerCase()) || tv.modelo.toLowerCase().includes(termo.toLowerCase()),
      )
      setTelevisoesFiltradas(filtradas)
    }
  }

  useEffect(() => {
    carregarTelevisoes()
  }, [])

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
        <Button
          asChild
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-md"
        >
          <Link href="/televisoes/nova">
            <Plus className="h-4 w-4 mr-2" />➕ Nova TV
          </Link>
        </Button>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Barra de busca */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="🔍 Buscar por marca ou modelo..."
                  value={busca}
                  onChange={(e) => filtrarTelevisoes(e.target.value)}
                  className="pl-10 border-2 border-purple-200 focus:border-purple-400"
                />
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Card className="bg-white/80 backdrop-blur-sm p-8">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                  <div className="text-2xl">📺</div>
                  <span className="text-lg font-medium text-gray-700">Carregando suas televisões...</span>
                </div>
              </Card>
            </div>
          ) : televisoesFiltradas.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📺💫</div>
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
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="mb-4 text-center">
                <Badge
                  variant="secondary"
                  className="text-lg px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-200"
                >
                  📊 {televisoesFiltradas.length} televisão{televisoesFiltradas.length !== 1 ? "ões" : ""} encontrada
                  {televisoesFiltradas.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {/* Grid de cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {televisoesFiltradas.map((televisao, index) => {
                  const corIndex = index % cores.length
                  const emojiIndex = index % emojisTV.length

                  return (
                    <Card
                      key={televisao._id}
                      className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                    >
                      {/* Header colorido */}
                      <div className={`bg-gradient-to-r ${cores[corIndex]} p-4 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="text-3xl">{emojisTV[emojiIndex]}</div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-white hover:bg-white/20 h-8 w-8 p-0"
                            >
                              <Link href={`/televisoes/editar/${televisao._id}`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={deletingId === televisao._id}
                                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                >
                                  {deletingId === televisao._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    🗑️ Confirmar exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a televisão{" "}
                                    <strong className="text-purple-700">
                                      {televisao.marca} {televisao.modelo}
                                    </strong>
                                    ? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>❌ Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => excluirTelevisao(televisao._id!)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    🗑️ Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo do card */}
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">🏷️ Marca</div>
                            <div className="font-bold text-lg text-gray-800">{televisao.marca}</div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500 mb-1">📱 Modelo</div>
                            <div className="font-medium text-gray-700">{televisao.modelo}</div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500 mb-1">📡 Canais</div>
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                              {televisao.quantidadeCanais} canais
                            </Badge>
                          </div>
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
