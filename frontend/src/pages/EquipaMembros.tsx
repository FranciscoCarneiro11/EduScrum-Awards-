import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { ArrowLeft, Users, Trash2, UserPlus } from "lucide-react"

type PapelScrum = "SCRUM_MASTER" | "PRODUCT_OWNER" | "DEVELOPER"

type MembroEquipa = {
  id: number             // id do MembroEquipa
  idUtilizador: number
  nomeUtilizador: string
  emailUtilizador: string
  papelScrum: PapelScrum
}

type EquipaDTO = {
  id: number
  nome: string
  idProjeto?: number | null
}

export default function EquipaMembros() {
  const navigate = useNavigate()
  const { projetoId, equipaId } = useParams()
  const { user } = useAuth()

  const isProfessor = user?.papelSistema === "PROFESSOR"

  const [equipa, setEquipa] = useState<EquipaDTO | null>(null)
  const [membros, setMembros] = useState<MembroEquipa[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar dados da equipa + membros
  async function fetchDados() {
    if (!equipaId) return
    try {
      setLoading(true)

      const [equipaRes, membrosRes] = await Promise.all([
        api.get<EquipaDTO>(`/api/equipas/${equipaId}`),
        api.get<MembroEquipa[]>(`/api/equipas/${equipaId}/membros`),
      ])

      setEquipa(equipaRes.data)
      setMembros(membrosRes.data)
    } catch (err) {
      console.error("Erro ao carregar equipa/membros", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDados()
  }, [equipaId])

  // Remover membro 
  async function handleRemoverMembro(idUtilizador: number) {
    if (!equipaId) return
    if (!confirm("Remover este membro da equipa?")) return

    try {
      await api.delete(`/api/equipas/${equipaId}/membros/${idUtilizador}`)
      await fetchDados()
    } catch (err) {
      console.error("Erro ao remover membro", err)
      alert("Erro ao remover membro")
    }
  }

  // FUTURO: adicionar membro (POST /api/equipas/{id}/membros)
  // Aqui depois vamos buscar a lista de alunos do projeto e permitir escolher.
  function handleAbrirAdicionarMembro() {
    alert("Adicionar membros — vamos implementar depois com seleção de alunos do projeto.")
  }

  // Helpers
  function getPapelLabel(papel: PapelScrum): string {
    if (papel === "SCRUM_MASTER") return "Scrum Master"
    if (papel === "PRODUCT_OWNER") return "Product Owner"
    return "Developer"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        A carregar equipa...
      </div>
    )
  }

  if (!equipa) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Equipa não encontrada.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8">
          <button
            onClick={() =>
              navigate(`/projetos/${projetoId}/equipas`)
            }
            className="flex items-center text-white hover:text-white/80 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar às equipas
          </button>

          <h1 className="text-3xl font-bold mb-1">
            {equipa.nome}
          </h1>
          <p className="text-indigo-100 text-sm">
            Gestão de membros da equipa
          </p>
        </div>

        {/* CARD LISTA DE MEMBROS */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Membros da Equipa
                  </h2>
                  <p className="text-sm text-gray-500">
                    {membros.length}{" "}
                    {membros.length === 1 ? "membro" : "membros"}
                  </p>
                </div>
              </div>

              {isProfessor && (
                <Button
                  onClick={handleAbrirAdicionarMembro}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar membro
                </Button>
              )}
            </div>

            <div className="divide-y">
              {membros.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar com iniciais */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {m.nomeUtilizador
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {m.nomeUtilizador}
                      </p>
                      <p className="text-xs text-gray-500">
                        {m.emailUtilizador}
                      </p>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full mt-1
                          ${
                            m.papelScrum === "SCRUM_MASTER"
                              ? "bg-yellow-100 text-yellow-700"
                              : m.papelScrum === "PRODUCT_OWNER"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {getPapelLabel(m.papelScrum)}
                      </span>
                    </div>
                  </div>

                  {/* Só professor pode remover */}
                  {isProfessor && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() =>
                        handleRemoverMembro(m.idUtilizador)
                      }
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}

              {membros.length === 0 && (
                <p className="text-sm text-gray-500 pt-2">
                  Ainda não há membros nesta equipa.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* NOTA PARA ALUNO */}
        {!isProfessor && (
          <p className="text-sm text-gray-500">
            Só o professor pode adicionar ou remover membros da equipa.
          </p>
        )}
      </div>
    </div>
  )
}
