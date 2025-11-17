import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, Users, FolderKanban, ArrowLeft, 
  GraduationCap, Plus, Edit, Trash2, CalendarDays
} from "lucide-react"

type Disciplina = {
  id: number
  nome: string
  codigo: string
}

type Curso = {
  id: number
  nome: string
  codigo: string
  adminId: number
  disciplinas: Disciplina[]
}

type Professor = {
  id: number
  nome: string
  email: string
}

type Aluno = {
  id: number
  nome: string
  email: string
}

type Projeto = {
  id: number
  nome: string
  descricao: string
  dataInicio: string
  dataFim: string
}

export default function ProfessorCursoDetalhes() {
  const { cursoId } = useParams<{ cursoId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [curso, setCurso] = useState<Curso | null>(null)
  const [professores, setProfessores] = useState<Professor[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)

  // Modais
  const [showDisciplinaModal, setShowDisciplinaModal] = useState(false)
  const [showProjetoModal, setShowProjetoModal] = useState(false)
  const [novaDisciplina, setNovaDisciplina] = useState({ nome: "", codigo: "" })
  const [novoProjeto, setNovoProjeto] = useState({ 
    nome: "", 
    descricao: "", 
    dataInicio: "", 
    dataFim: "" 
  })

  // No useEffect, adiciona logs para debug:

  useEffect(() => {
    if (!cursoId || !user) return

    async function carregarDados() {
      try {
        setLoading(true)

        // Curso com disciplinas
        const cursoRes = await api.get<Curso>(`/api/cursos/${cursoId}`)
        setCurso(cursoRes.data)

        // Carregar projetos do curso
        const projetosRes = await api.get<Projeto[]>(`/api/cursos/${cursoId}/projetos`)
        setProjetos(projetosRes.data)

        // Professores associados ao curso
        const profsRes = await api.get<Professor[]>(`/api/cursos/${cursoId}/professores`)
        setProfessores(profsRes.data)
        
        // const alunosRes = await api.get<Aluno[]>(`/api/cursos/${cursoId}/alunos`)
        // setAlunos(alunosRes.data)


        // Alunos do curso
        const alunosRes = await api.get<Aluno[]>(`/api/cursos/${cursoId}/alunos`)
        setAlunos(alunosRes.data)

      } catch (err) {
        console.error("Erro ao carregar detalhes do curso:", err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [cursoId, user])

  // Criar disciplina
  const handleCriarDisciplina = async () => {
    try {
      await api.post(`/api/cursos/${cursoId}/disciplinas`, novaDisciplina)
      
      // Recarregar curso
      const cursoRes = await api.get<Curso>(`/api/cursos/${cursoId}`)
      setCurso(cursoRes.data)
      
      setShowDisciplinaModal(false)
      setNovaDisciplina({ nome: "", codigo: "" })
    } catch (err) {
      console.error("Erro ao criar disciplina:", err)
      alert("Erro ao criar disciplina")
    }
  }

  // Criar projeto
  const handleCriarProjeto = async () => {
    try {
      await api.post(`/api/cursos/${cursoId}/projetos`, novoProjeto)
      
      // Recarregar projetos
      const projetosRes = await api.get<Projeto[]>(`/api/cursos/${cursoId}/projetos`)
      setProjetos(projetosRes.data)
      
      setShowProjetoModal(false)
      setNovoProjeto({ nome: "", descricao: "", dataInicio: "", dataFim: "" })
    } catch (err) {
      console.error("Erro ao criar projeto:", err)
      alert("Erro ao criar projeto")
    }
  }

  // Eliminar disciplina
  const handleEliminarDisciplina = async (disciplinaId: number) => {
    if (!confirm("Tem certeza que deseja eliminar esta disciplina?")) return

    try {
      await api.delete(`/api/cursos/${cursoId}/disciplinas/${disciplinaId}`)
      
      // Recarregar curso
      const cursoRes = await api.get<Curso>(`/api/cursos/${cursoId}`)
      setCurso(cursoRes.data)
    } catch (err) {
      console.error("Erro ao eliminar disciplina:", err)
      alert("Erro ao eliminar disciplina")
    }
  }

  // Eliminar projeto
  const handleEliminarProjeto = async (projetoId: number) => {
    if (!confirm("Tem certeza que deseja eliminar este projeto?")) return

    try {
      await api.delete(`/api/projetos/${projetoId}`)
      
      // Recarregar projetos
      const projetosRes = await api.get<Projeto[]>(`/api/cursos/${cursoId}/projetos`)
      setProjetos(projetosRes.data)
    } catch (err) {
      console.error("Erro ao eliminar projeto:", err)
      alert("Erro ao eliminar projeto")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar curso...</p>
        </div>
      </div>
    )
  }

  if (!curso) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Curso não encontrado</h2>
          <Button onClick={() => navigate("/professor/cursos")}>
            Voltar aos meus cursos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/professor/cursos")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos cursos
        </Button>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
                {curso.codigo}
              </span>
              <h1 className="text-4xl font-bold mb-2">{curso.nome}</h1>
              <p className="text-indigo-100">
                Gestão de disciplinas, projetos e alunos
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <GraduationCap className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{curso.disciplinas?.length || 0}</p>
              <p className="text-sm text-gray-600">Disciplinas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{professores.length}</p>
              <p className="text-sm text-gray-600">Professores</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{alunos.length}</p>
              <p className="text-sm text-gray-600">Alunos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projetos.length}</p>
              <p className="text-sm text-gray-600">Projetos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Disciplinas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Disciplinas do Curso
              </CardTitle>
              <Button 
                onClick={() => setShowDisciplinaModal(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Disciplina
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {curso.disciplinas && curso.disciplinas.length > 0 ? (
              <div className="space-y-3">
                {curso.disciplinas.map((disc) => (
                  <div
                    key={disc.id}
                    className="p-4 border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{disc.nome}</h3>
                        <p className="text-sm text-gray-500">{disc.codigo}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEliminarDisciplina(disc.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Ainda não existem disciplinas neste curso.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Projetos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Projetos do Curso
              </CardTitle>
              <Button 
                onClick={() => setShowProjetoModal(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {projetos.length > 0 ? (
              <div className="space-y-3">
                {projetos.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{proj.nome}</h3>
                        <p className="text-sm text-gray-600 mt-1">{proj.descricao}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            Início: {new Date(proj.dataInicio).toLocaleDateString("pt-PT")}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            Fim: {new Date(proj.dataFim).toLocaleDateString("pt-PT")}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEliminarProjeto(proj.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Ainda não existem projetos neste curso.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Lista de Alunos e Professores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Professores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {professores.length > 0 ? (
                <ul className="space-y-3">
                  {professores.map((prof) => (
                    <li key={prof.id} className="flex items-center gap-3 p-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {prof.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{prof.nome}</p>
                        <p className="text-sm text-gray-500">{prof.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum professor atribuído
                </p>
              )}
            </CardContent>
          </Card>

          {/* Alunos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alunos.length > 0 ? (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {alunos.map((aluno) => (
                    <li key={aluno.id} className="flex items-center gap-3 p-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {aluno.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{aluno.nome}</p>
                        <p className="text-sm text-gray-500">{aluno.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum aluno matriculado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Criar Disciplina */}
      {showDisciplinaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Nova Disciplina</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Disciplina</label>
                <input
                  type="text"
                  value={novaDisciplina.nome}
                  onChange={(e) => setNovaDisciplina({ ...novaDisciplina, nome: e.target.value })}
                  placeholder="Ex: Programação Web"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Código</label>
                <input
                  type="text"
                  value={novaDisciplina.codigo}
                  onChange={(e) => setNovaDisciplina({ ...novaDisciplina, codigo: e.target.value })}
                  placeholder="Ex: PW2024"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowDisciplinaModal(false)
                    setNovaDisciplina({ nome: "", codigo: "" })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCriarDisciplina}
                  className="flex-1 bg-violet-600 hover:bg-violet-700"
                  disabled={!novaDisciplina.nome || !novaDisciplina.codigo}
                >
                  Criar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Criar Projeto */}
      {showProjetoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Novo Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Projeto</label>
                <input
                  type="text"
                  value={novoProjeto.nome}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, nome: e.target.value })}
                  placeholder="Ex: Sistema de Gestão"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={novoProjeto.descricao}
                  onChange={(e) => setNovoProjeto({ ...novoProjeto, descricao: e.target.value })}
                  placeholder="Breve descrição do projeto"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data Início</label>
                  <input
                    type="date"
                    value={novoProjeto.dataInicio}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, dataInicio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={novoProjeto.dataFim}
                    onChange={(e) => setNovoProjeto({ ...novoProjeto, dataFim: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowProjetoModal(false)
                    setNovoProjeto({ nome: "", descricao: "", dataInicio: "", dataFim: "" })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCriarProjeto}
                  className="flex-1 bg-violet-600 hover:bg-violet-700"
                  disabled={!novoProjeto.nome || !novoProjeto.dataInicio || !novoProjeto.dataFim}
                >
                  Criar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}