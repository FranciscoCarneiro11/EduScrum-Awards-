import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, TrendingUp, FolderOpen, Sparkles } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function AlunoDashboard() {
  const { user } = useAuth()

  // Dados simulados (depois ligamos à API)
  const stats = {
    pontos: 320,
    premios: 5,
    ranking: 3,
    projetosAtivos: 2,
  }

  const premiosRecentes = [
    { nome: "OnTime Legend", descricao: "Entregou todos os sprints a tempo", pontos: 10, data: "20/10/2025" },
    { nome: "Innovation Hero", descricao: "Solução criativa no projeto final", pontos: 15, data: "25/10/2025" },
    { nome: "Team Player", descricao: "Excelente colaboração na equipa", pontos: 8, data: "28/10/2025" },
  ]

  const graficoPontos = [
    { mes: "Jul", pontos: 100 },
    { mes: "Ago", pontos: 150 },
    { mes: "Set", pontos: 250 },
    { mes: "Out", pontos: 320 },
  ]

  const projetos = [
    { nome: "EduScrum Awards", progresso: "80%", sprint: "Sprint 3", status: "Em curso" },
    { nome: "SmartCampus", progresso: "45%", sprint: "Sprint 1", status: "Em curso" },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium text-indigo-100">Dashboard do Aluno</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Bem vindo!
            </h1>
            <p className="text-indigo-100">
              Acompanha o teu progresso e conquista novos prémios
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Trophy className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Cards de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <Card className="bg-gradient-to-br from-violet-50 to-purple-100 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600 font-medium mb-1">Total de Pontos</p>
                <p className="text-3xl font-bold text-violet-700">{stats.pontos}</p>
              </div>
              <Trophy className="w-12 h-12 text-violet-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium mb-1">Prémios Recebidos</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.premios}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Ranking</p>
                <p className="text-3xl font-bold text-blue-700">#{stats.ranking}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Projetos Ativos</p>
                <p className="text-3xl font-bold text-green-700">{stats.projetosAtivos}</p>
              </div>
              <FolderOpen className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Gráfico de Evolução */}
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>Evolução dos Pontos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graficoPontos}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pontos" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grid: Prémios + Projetos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Últimos Prémios */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Últimos Prémios
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {premiosRecentes.length > 0 ? (
              <ul className="space-y-4">
                {premiosRecentes.map((p, i) => (
                  <li key={i} className="border-b border-gray-100 pb-3 last:border-none">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-violet-700">{p.nome}</p>
                        <p className="text-sm text-gray-600">{p.descricao}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-violet-600">+{p.pontos} pts</p>
                        <p className="text-xs text-gray-400">{p.data}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-8">Ainda não tens prémios</p>
            )}
          </CardContent>
        </Card>

        {/* Projetos Ativos */}
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-green-600" />
              Projetos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {projetos.length > 0 ? (
              <div className="space-y-4">
                {projetos.map((proj, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{proj.nome}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {proj.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{proj.sprint}</span>
                      <span className="font-medium text-violet-600">{proj.progresso}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Nenhum projeto ativo</p>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  )
}