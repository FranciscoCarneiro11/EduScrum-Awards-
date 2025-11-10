import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star, ChartLine, FolderOpen } from "lucide-react"
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
    { nome: "EduScrum Awards", progresso: "80%", sprint: "Sprint 3" },
    { nome: "SmartCampus", progresso: "45%", sprint: "Sprint 1" },
  ]

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Bem-vindo, {user?.nome || "Aluno"} 
      </h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <Trophy className="text-violet-600 mb-2" size={28} />
            <h2 className="text-lg font-semibold">{stats.pontos}</h2>
            <p className="text-sm text-gray-500">Total de Pontos</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <Star className="text-yellow-500 mb-2" size={28} />
            <h2 className="text-lg font-semibold">{stats.premios}</h2>
            <p className="text-sm text-gray-500">Prémios Recebidos</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <ChartLine className="text-blue-500 mb-2" size={28} />
            <h2 className="text-lg font-semibold">#{stats.ranking}</h2>
            <p className="text-sm text-gray-500">Ranking</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <FolderOpen className="text-green-600 mb-2" size={28} />
            <h2 className="text-lg font-semibold">{stats.projetosAtivos}</h2>
            <p className="text-sm text-gray-500">Projetos Ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Progresso */}
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Evolução dos Pontos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graficoPontos}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pontos" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Últimos Prémios */}
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Últimos Prémios</h2>
          <ul className="space-y-3">
            {premiosRecentes.map((p, i) => (
              <li key={i} className="border-b border-gray-100 pb-2">
                <p className="font-medium text-violet-700">{p.nome}</p>
                <p className="text-sm text-gray-600">{p.descricao}</p>
                <p className="text-xs text-gray-400">{p.pontos} pts — {p.data}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Projetos Ativos */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Projetos Ativos</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="pb-2">Projeto</th>
                <th className="pb-2">Sprint Atual</th>
                <th className="pb-2">Progresso</th>
              </tr>
            </thead>
            <tbody>
              {projetos.map((proj, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-2">{proj.nome}</td>
                  <td className="py-2">{proj.sprint}</td>
                  <td className="py-2">{proj.progresso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
