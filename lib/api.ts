const API_BASE_URL = "https://crudcrud.com/api/36ef6de30e024f73a5e4d40a7b74353d"

export interface Televisao {
  _id?: string
  marca: string
  modelo: string
  quantidadeCanais: number
}

export class TelevisaoAPI {
  private static async request(endpoint: string, options?: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
    }

    if (response.status === 204 || options?.method === "DELETE") {
      return null
    }

    return response.json()
  }

  static async listarTelevisoes(): Promise<Televisao[]> {
    try {
      return await this.request("/televisoes")
    } catch (error) {
      console.error("Erro ao listar televisões:", error)
      throw error
    }
  }

  static async criarTelevisao(televisao: Omit<Televisao, "_id">): Promise<Televisao> {
    try {
      return await this.request("/televisoes", {
        method: "POST",
        body: JSON.stringify(televisao),
      })
    } catch (error) {
      console.error("Erro ao criar televisão:", error)
      throw error
    }
  }

  static async atualizarTelevisao(id: string, televisao: Omit<Televisao, "_id">): Promise<Televisao> {
    try {
      return await this.request(`/televisoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(televisao),
      })
    } catch (error) {
      console.error("Erro ao atualizar televisão:", error)
      throw error
    }
  }

  static async excluirTelevisao(id: string): Promise<void> {
    try {
      await this.request(`/televisoes/${id}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Erro ao excluir televisão:", error)
      throw error
    }
  }
}
