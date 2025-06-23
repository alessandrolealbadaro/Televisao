"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { TelevisaoAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface EditarTelevisaoPageProps {
  params: Promise<{ id: string }>
}

export default function EditarTelevisaoPage({ params }: EditarTelevisaoPageProps) {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    quantidadeCanais: "",
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [televisaoId, setTelevisaoId] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setTelevisaoId(resolvedParams.id)
      await carregarTelevisao(resolvedParams.id)
    }
    loadParams()
  }, [params])

  const carregarTelevisao = async (id: string) => {
    try {
      setLoadingData(true)
      const televisoes = await TelevisaoAPI.listarTelevisoes()
      const televisao = televisoes.find((tv) => tv._id === id)

      if (televisao) {
        setFormData({
          marca: televisao.marca,
          modelo: televisao.modelo,
          quantidadeCanais: televisao.quantidadeCanais.toString(),
        })
      } else {
        toast({
          title: "❌ Erro",
          description: "Televisão não encontrada.",
          variant: "destructive",
        })
        router.push("/televisoes")
      }
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os dados da televisão.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.marca || !formData.modelo || !formData.quantidadeCanais) {
      toast({
        title: "⚠️ Atenção",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const quantidadeCanais = Number.parseInt(formData.quantidadeCanais)
    if (isNaN(quantidadeCanais) || quantidadeCanais <= 0) {
      toast({
        title: "⚠️ Erro",
        description: "A quantidade de canais deve ser um número positivo.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await TelevisaoAPI.atualizarTelevisao(televisaoId, {
        marca: formData.marca,
        modelo: formData.modelo,
        quantidadeCanais,
      })

      toast({
        title: "🎉 Sucesso!",
        description: "Televisão atualizada com sucesso!",
      })

      router.push("/televisoes")
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar a televisão.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (loadingData) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-bold text-gray-600">Carregando...</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center py-12">
            <Card className="bg-white/80 backdrop-blur-sm p-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                <div className="text-4xl">📺</div>
                <span className="text-lg font-medium text-gray-700">Carregando dados da televisão...</span>
              </div>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 flex-1">
          <Button variant="ghost" size="sm" asChild className="hover:bg-purple-100">
            <Link href="/televisoes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ⬅️ Voltar
            </Link>
          </Button>
          <span className="text-2xl">✏️</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Editar Televisão
          </h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header com emoji */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✏️📺</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              Editar Televisão
            </h2>
            <p className="text-gray-600">Atualize os dados da sua televisão</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">✏️</div>
                <div>
                  <CardTitle className="text-xl">Formulário de Edição</CardTitle>
                  <CardDescription className="text-orange-100">Atualize as informações da televisão</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="marca" className="text-gray-700 font-semibold flex items-center gap-2">
                    🏷️ Marca da Televisão
                  </Label>
                  <Input
                    id="marca"
                    name="marca"
                    placeholder="Ex: Samsung, LG, Sony, Philips..."
                    value={formData.marca}
                    onChange={handleChange}
                    className="border-2 border-gray-200 focus:border-orange-400 text-lg p-3"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo" className="text-gray-700 font-semibold flex items-center gap-2">
                    📱 Modelo da Televisão
                  </Label>
                  <Input
                    id="modelo"
                    name="modelo"
                    placeholder="Ex: UN55AU7700, OLED55C1PSA, 55PUG7625..."
                    value={formData.modelo}
                    onChange={handleChange}
                    className="border-2 border-gray-200 focus:border-orange-400 text-lg p-3"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantidadeCanais" className="text-gray-700 font-semibold flex items-center gap-2">
                    📡 Quantidade de Canais
                  </Label>
                  <Input
                    id="quantidadeCanais"
                    name="quantidadeCanais"
                    type="number"
                    min="1"
                    placeholder="Ex: 100, 200, 500..."
                    value={formData.quantidadeCanais}
                    onChange={handleChange}
                    className="border-2 border-gray-200 focus:border-orange-400 text-lg p-3"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md text-lg py-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />💾 Salvar Alterações
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-lg py-3 px-6"
                  >
                    <Link href="/televisoes">❌ Cancelar</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">Dicas para edição:</h4>
                  <ul className="text-sm text-orange-600 space-y-1">
                    <li>• Verifique se os dados estão corretos antes de salvar</li>
                    <li>• Use informações precisas sobre marca e modelo</li>
                    <li>• A quantidade de canais deve ser um número positivo</li>
                    <li>• As alterações serão salvas imediatamente</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
