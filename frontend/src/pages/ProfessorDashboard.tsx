import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, BookOpen, Target, TrendingUp, ArrowRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

// Tipos
type Disciplina = {
  id: number
  nome: string
  codigo: string
  cursoId: number
}

type Curso = {
  id: number
  nome: string
  disciplinas: Disciplina[]
}

type Stats = {
  totalDisciplinas: number
  totalEquipas: number
  totalAlunos: number
  totalPremios: number
}

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [cursos, setCursos] = useState<Curso[]>([])
  const [todasDisciplinas, setTodasDisciplinas] = useState<Disciplina[]>([])
  const [stats, setStats] = useState<Stats>({
    totalDisciplinas: 0,
    totalEquipas: 0,
    totalAlunos: 0,
    totalPremios: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchDados() {
      try {
        setLoading(true)

        // 1. Buscar Cursos do Professor
        const resCursos = await api.get<Curso[]>(`/api/professores/${user?.id}/cursos`)
        setCursos(resCursos.data)

        // 2. Extrair todas as disciplinas
        const disciplinas = resCursos.data.flatMap(c => c.disciplinas || [])
        setTodasDisciplinas(disciplinas)

        // 3. Calcular Stats (Ciclo para contar Alunos e Prémios)
        let totalAlunosCount = 0
        let totalPremiosCount = 0

        // Nota: Isto faz muitos pedidos à API. Num projeto real, farias um endpoint "/api/stats/professor"
        for (const curso of resCursos.data) {
          try {
            // Buscar alunos do curso
            const resAlunos = await api.get<any[]>(`/api/cursos/${curso.id}/alunos`)
            totalAlunosCount += resAlunos.data.length

            // Para cada aluno, ver quantas conquistas tem
            for (const aluno of resAlunos.data) {
              const resConquistas = await api.get<any[]>(`/api/alunos/${aluno.id}/conquistas`)
              totalPremiosCount += resConquistas.data.length
            }

          } catch (e) { console.error(e) }
        }
        
        setStats({
          totalDisciplinas: disciplinas.length,
          totalAlunos: totalAlunosCount,
          totalEquipas: 0, // Mantemos a 0 pois não é crítico para o enunciado imediato
          totalPremios: totalPremiosCount
        })

      } catch (error) {
        console.error("Erro ao carregar dashboard professor", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDados()
  }, [user])

  // Gráfico Simulado (placeholder visualmente agradável)
  const dadosGrafico = [
    { name: 'Qualidade Soft.', pontos: 120 },
    { name: 'Prog. Web', pontos: 85 },
    { name: 'Bases Dados', pontos: 200 },
    { name: 'Eng. Req.', pontos: 150 },
  ]
  const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#3b82f6']

  if (loading) return <div className="p-10 text-center text-gray-500">A carregar o teu painel...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium text-indigo-100">Área do Docente</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Bem-vindo, Prof. {user?.nome?.split(" ")[0]}!
            </h1>
            <p className="text-indigo-100">
              A gerir <strong>{stats.totalDisciplinas} disciplinas</strong> e <strong>{stats.totalAlunos} alunos</strong>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <BookOpen className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-violet-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Minhas Disciplinas</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalDisciplinas}</p>
            </div>
            <div className="p-3 bg-violet-100 rounded-full text-violet-600">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total de Alunos</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAlunos}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Prémios Atribuídos</p>
              <p className="text-3xl font-bold text-gray-800">--</p> {/* Placeholder */}
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Trophy className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Disciplinas */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-600" />
              As Minhas Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {todasDisciplinas.length > 0 ? (
              <div className="divide-y">
                {todasDisciplinas.map((disc) => (
                  <div key={disc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                      <h4 className="font-semibold text-gray-800">{disc.nome}</h4>
                      <p className="text-sm text-gray-500">{disc.codigo}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/disciplinas/${disc.id}/premios`)}
                      >
                        <Trophy className="w-4 h-4 mr-2 text-amber-500" />
                        Prémios
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                        onClick={() => navigate(`/disciplinas/${disc.id}`)}
                      >
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Ainda não tens disciplinas atribuídas.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Gamificação */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Pontos por Turma
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico}>
                  <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pontos" radius={[4, 4, 0, 0]}>
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">
              *Dados simulados para demonstração de atividade
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}