import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FolderOpen } from "lucide-react"
import CriarProjetoModal from "@/components/CriarProjetoModal"

export default function DisciplinaDetalhes() {
  const { disciplinaId } = useParams()
  const { user } = useAuth()

  const [disciplina, setDisciplina] = useState<any>(null)
  const [projetos, setProjetos] = useState<any[]>([])
  const [professores, setProfessores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // --------------------------
  // Função para atualizar projetos
  // --------------------------
  async function carregarProjetos() {
    const response = await api.get(`/api/disciplinas/${disciplinaId}/projetos`)
    setProjetos(response.data)
  }

  // --------------------------
  // Carregamento inicial da página
  // --------------------------
  useEffect(() => {
    if (!disciplinaId) return

    async function fetchData() {
      try {
        const d = await api.get(`/api/disciplinas/${disciplinaId}`)
        setDisciplina(d.data)

        await carregarProjetos()

        const professoresResp = await api.get(
          `/api/cursos/${d.data.cursoId}/professores`
        )
        setProfessores(professoresResp.data)
      } catch (error) {
        console.error("Erro ao carregar disciplina:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [disciplinaId])

  if (loading) return <div className="p-8 text-center">Carregando...</div>
  if (!disciplina) return <div className="p-8 text-center">Disciplina não encontrada.</div>

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-2xl p-8 mb-10 shadow-lg">
        <h1 className="text-4xl font-bold">{disciplina.nome}</h1>
        <p className="text-lg opacity-90">{disciplina.codigo}</p>

        <Link
          to={`/cursos/${disciplina.cursoId}`}
          className="underline text-white/90 text-sm mt-3 inline-block"
        >
          Voltar ao curso: {disciplina.cursoNome}
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* PROJETOS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FolderOpen size={20} /> Projetos da Disciplina
            </h2>

            {user?.papelSistema === "PROFESSOR" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Criar Projeto
              </button>
            )}
          </div>

          {projetos.length === 0 ? (
            <div className="text-gray-500 text-sm">Ainda não existem projetos.</div>
          ) : (
            projetos.map((proj) => (
              <Card key={proj.id} className="hover:shadow-md transition">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg">{proj.nome}</h3>
                  <p className="text-gray-600 text-sm mb-2">{proj.descricao}</p>

                  <p className="text-xs text-gray-500">
                    {proj.dataInicio} → {proj.dataFim}
                  </p>

                  <Link
                    to={`/projetos/${proj.id}`}
                    className="mt-3 inline-block text-purple-600 hover:underline"
                  >
                    Ver projeto →
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* PROFESSORES */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users size={20} /> Professores
          </h2>

          {professores.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum professor associado.</p>
          ) : (
            professores.map((prof) => (
              <Card key={prof.id} className="hover:shadow-md transition">
                <CardContent className="p-5 flex flex-col">
                  <span className="font-medium">{prof.nome}</span>
                  <span className="text-gray-500 text-sm">{prof.email}</span>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE CRIAR PROJETO */}
      {showModal && (
        <CriarProjetoModal
          disciplinaId={Number(disciplinaId)}
          onClose={() => setShowModal(false)}
          onCreated={carregarProjetos}
        />
      )}
    </div>
  )
}

