import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ArrowLeft, Plus, CalendarDays, Target, Timer, Trash2, X,MoreHorizontal } from "lucide-react"

// TIPOS 
type Sprint = {
  id: number
  nome: string
  objetivos: string
  dataInicio: string
  dataFim: string
  projetoId: number
}

type Projeto = {
  id: number
  nome: string
}

type SprintStatus = "EM_CURSO" | "PLANEAMENTO" | "CONCLUIDO"

export default function Sprints() {
  const { projetoId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isProfessor = user?.papelSistema === "PROFESSOR"

  //  ESTADOS 
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)

  // Modal Criar Sprint
  const [showModal, setShowModal] = useState(false)
  const [novoSprint, setNovoSprint] = useState({
    nome: "",
    objetivos: "",
    dataInicio: "",
    dataFim: ""
  })
  const [loadingCriar, setLoadingCriar] = useState(false)

  // API 
  async function fetchData() {
    if (!projetoId) return
    try {
      setLoading(true)
      const [projRes, sprintsRes] = await Promise.all([
        api.get<Projeto>(`/api/projetos/${projetoId}`),
        api.get<Sprint[]>(`/api/projetos/${projetoId}/sprints`)
      ])
      setProjeto(projRes.data)
      
      // Ordenar sprints por data de início 
      const sprintsOrdenados = sprintsRes.data.sort((a, b) => 
        new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
      )
      setSprints(sprintsOrdenados)

    } catch (err) {
      console.error("Erro ao carregar dados", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [projetoId])

  // ACTIONS 
  async function handleCriarSprint(e: React.FormEvent) {
    e.preventDefault()
    if (!projetoId) return

    try {
      setLoadingCriar(true)
      await api.post(`/api/projetos/${projetoId}/sprints`, {
        ...novoSprint,
        projetoId: Number(projetoId)
      })
      
      setShowModal(false)
      setNovoSprint({ nome: "", objetivos: "", dataInicio: "", dataFim: "" })
      await fetchData()
    } catch (err) {
      console.error("Erro ao criar sprint", err)
      alert("Erro ao criar sprint.")
    } finally {
      setLoadingCriar(false)
    }
  }

  async function handleDeleteSprint(id: number) {
    if (!confirm("Tens a certeza que queres apagar este sprint?")) return
    try {
      await api.delete(`/api/sprints/${id}`)
      await fetchData()
    } catch (err) {
      console.error("Erro ao apagar", err)
      alert("Erro ao apagar sprint.")
    }
  }

  // HELPERS 
  function getStatus(inicio: string, fim: string): SprintStatus {
    const agora = new Date().getTime()
    const dInicio = new Date(inicio).getTime()
    const dFim = new Date(fim).getTime()

    if (agora < dInicio) return "PLANEAMENTO"
    if (agora > dFim) return "CONCLUIDO"
    return "EM_CURSO"
  }

  function renderStatusBadge(status: SprintStatus) {
    const styles = {
      EM_CURSO: "bg-green-100 text-green-700 border-green-200",
      PLANEAMENTO: "bg-yellow-100 text-yellow-700 border-yellow-200",
      CONCLUIDO: "bg-gray-100 text-gray-600 border-gray-200"
    }
    const labels = {
      EM_CURSO: "Em Curso",
      PLANEAMENTO: "Planeamento",
      CONCLUIDO: "Concluído"
    }

    return (
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  // RENDER 
  if (loading) return <div className="flex h-screen items-center justify-center">A carregar...</div>
  if (!projeto) return <div className="flex h-screen items-center justify-center">Projeto não encontrado.</div>

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <button
              onClick={() => navigate(-1)} 
              className="flex items-center text-white/80 hover:text-white transition mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Projeto
            </button>
            <h1 className="text-4xl font-bold mb-2">Sprints do Projeto</h1>
            <p className="text-indigo-100 text-lg opacity-90">{projeto.nome}</p>
          </div>
          
          {/* Ícone Decorativo */}
          <Timer className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 text-white opacity-10" />
        </div>

        {/* ACTION BAR (Só Professor) */}
        {isProfessor && (
          <div className="flex justify-end mb-6">
            <Button 
              onClick={() => setShowModal(true)}
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Sprint
            </Button>
          </div>
        )}

        {/* LISTA DE SPRINTS */}
        <div className="grid gap-6">
          {sprints.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sem Sprints definidos</h3>
              <p className="text-gray-500 mt-1">
                {isProfessor ? "Cria o primeiro sprint para começar." : "O professor ainda não definiu sprints."}
              </p>
            </div>
          ) : (
            sprints.map((sprint) => {
              const status = getStatus(sprint.dataInicio, sprint.dataFim)
              
              return (
                <Card key={sprint.id} className={`border-l-4 shadow-sm hover:shadow-md transition-shadow
                  ${status === 'EM_CURSO' ? 'border-l-green-500' : 
                    status === 'PLANEAMENTO' ? 'border-l-yellow-500' : 'border-l-gray-300'}
                `}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      
                      {/* Info Principal */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{sprint.nome}</h3>
                          {renderStatusBadge(status)}
                        </div>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-4 bg-gray-50 w-fit px-3 py-1 rounded-md">
                          <CalendarDays className="w-4 h-4 mr-2 text-violet-600" />
                          <span>
                            {new Date(sprint.dataInicio).toLocaleDateString('pt-PT')} 
                            {' '}<span className="text-gray-400 mx-1">➔</span>{' '}
                            {new Date(sprint.dataFim).toLocaleDateString('pt-PT')}
                          </span>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Target className="w-3 h-3" /> Objetivos
                          </h4>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {sprint.objetivos || "Sem objetivos definidos."}
                          </p>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        {isProfessor && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteSprint(sprint.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Apagar
                          </Button>
                        )}
                        {/* Futuro: Botão para ver tarefas/detalhes do sprint */}
                        <Button variant="outline" size="sm" className="justify-start">
                          <MoreHorizontal className="w-4 h-4 mr-2" />
                          Detalhes
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

      </div>

      {/* MODAL CRIAR SPRINT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Novo Sprint</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarSprint} className="p-6 space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Sprint</Label>
                <Input 
                  id="nome" 
                  placeholder="Ex: Sprint 1 - Planeamento" 
                  value={novoSprint.nome}
                  onChange={e => setNovoSprint({...novoSprint, nome: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inicio">Data Início</Label>
                  <Input 
                    id="inicio" 
                    type="date" 
                    value={novoSprint.dataInicio}
                    onChange={e => setNovoSprint({...novoSprint, dataInicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fim">Data Fim</Label>
                  <Input 
                    id="fim" 
                    type="date" 
                    value={novoSprint.dataFim}
                    onChange={e => setNovoSprint({...novoSprint, dataFim: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="objetivos">Objetivos</Label>
                <textarea 
                  id="objetivos"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  placeholder="Descreve os principais objetivos deste sprint..."
                  value={novoSprint.objetivos}
                  onChange={e => setNovoSprint({...novoSprint, objetivos: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={loadingCriar}>
                  {loadingCriar ? "A criar..." : "Criar Sprint"}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}