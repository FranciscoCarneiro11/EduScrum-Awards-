import { useState } from "react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"

interface CriarProjetoModalProps {
  disciplinaId: number
  onClose: () => void
  onCreated: () => void
}

export default function CriarProjetoModal({ disciplinaId, onClose, onCreated }: CriarProjetoModalProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [loading, setLoading] = useState(false)

  async function criarProjeto(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post(`/api/disciplinas/${disciplinaId}/projetos`, {
        nome,
        descricao,
        dataInicio,
        dataFim
      })

      onCreated()   // atualiza a lista
      onClose()     // fecha modal
    } catch (error) {
      console.error("Erro ao criar projeto", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">

        <h2 className="text-xl font-bold mb-4">Criar Projeto</h2>

        <form onSubmit={criarProjeto} className="space-y-3">
          <div>
            <label className="block font-medium">Nome</label>
            <input
              className="w-full border p-2 rounded"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Descrição</label>
            <textarea
              className="w-full border p-2 rounded"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Data de Início</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Data de Fim</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "A criar..." : "Criar"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
