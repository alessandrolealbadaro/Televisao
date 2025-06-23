const API_BASE_URL = "https://crudcrud.com/api/36ef6de30e024f73a5e4d40a7b74353d"

export interface Televisao {
  _id?: string
  marca: string
  modelo: string
  quantidadeCanais: number
}

export class TelevisaoAPI {
  static async listarTelevisoes(): Promise<Televisao[]> {
    try {
      console.log("Fazendo requisição para:", `${API_BASE_URL}/televisoes`)

      const response = await fetch(`${API_BASE_URL}/televisoes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Dados recebidos da API:", data)

      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error("Erro ao listar televisões:", error)
      throw error
    }
  }

  static async criarTelevisao(televisao: Omit<Televisao, "_id">): Promise<Televisao> {
    try {
      console.log("Criando televisão:", televisao)

      const response = await fetch(`${API_BASE_URL}/televisoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(televisao),
      })

      console.log("Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Televisão criada:", data)

      return data
    } catch (error) {
      console.error("Erro ao criar televisão:", error)
      throw error
    }
  }

  static async obterTelevisao(id: string): Promise<Televisao> {
    try {
      console.log("Obtendo televisão com ID:", id)

      const response = await fetch(`${API_BASE_URL}/televisoes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Status da resposta:", response.status)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Televisão obtida:", data)

      return data
    } catch (error) {
      console.error("Erro ao obter televisão:", error)
      throw error
    }
  }

  static async atualizarTelevisao(id: string, televisao: Omit<Televisao, "_id">): Promise<Televisao> {
    try {
      console.log("Atualizando televisão:", id, televisao)

      const response = await fetch(`${API_BASE_URL}/televisoes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(televisao),
      })

      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
      }

      // Verificar se há conteúdo na resposta
      const contentLength = response.headers.get("content-length")
      const contentType = response.headers.get("content-type")

      console.log("Content-Length:", contentLength)
      console.log("Content-Type:", contentType)

      // Se não há conteúdo ou é muito pequeno, retornar os dados enviados com o ID
      if (contentLength === "0" || contentLength === null) {
        console.log("Resposta vazia - retornando dados enviados")
        return { _id: id, ...televisao }
      }

      // Tentar fazer parse do JSON apenas se há conteúdo
      try {
        const responseText = await response.text()
        console.log("Texto da resposta:", responseText)

        if (!responseText || responseText.trim() === "") {
          console.log("Resposta vazia - retornando dados enviados")
          return { _id: id, ...televisao }
        }

        const data = JSON.parse(responseText)
        console.log("Televisão atualizada:", data)
        return data
      } catch (parseError) {
        console.log("Erro ao fazer parse JSON, mas operação foi bem-sucedida")
        console.log("Parse error:", parseError)
        // Se não conseguir fazer parse mas a resposta foi 200, assumir sucesso
        return { _id: id, ...televisao }
      }
    } catch (error) {
      console.error("Erro ao atualizar televisão:", error)
      throw error
    }
  }

  static async excluirTelevisao(id: string): Promise<void> {
    try {
      console.log("=== EXCLUIR TELEVISÃO ===")
      console.log("ID para excluir:", id)
      console.log("URL completa:", `${API_BASE_URL}/televisoes/${id}`)

      const response = await fetch(`${API_BASE_URL}/televisoes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Status da resposta:", response.status)
      console.log("Status text:", response.statusText)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

      // Verificar diferentes códigos de sucesso para DELETE
      if (response.status === 200 || response.status === 204 || response.status === 202) {
        console.log("✅ Exclusão bem-sucedida!")
        return
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Erro desconhecido")
        console.log("Texto do erro:", errorText)
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}. Detalhes: ${errorText}`)
      }

      console.log("✅ Televisão excluída com sucesso")
    } catch (error) {
      console.error("❌ Erro ao excluir televisão:", error)

      // Se for erro de rede, dar uma mensagem mais clara
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Erro de conexão. Verifique sua internet e tente novamente.")
      }

      throw error
    }
  }
}
