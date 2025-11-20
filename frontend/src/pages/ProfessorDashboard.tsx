import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ClipboardList, BookOpen, TrendingUp, Sparkles } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

export default function ProfessorDashboard() {

  // Dados estáticos para já — depois ligamos ao backend
  const stats = {
    totalDisciplinas: 3,
    totalQuizzes: 12,
    totalEquipas: 5,
    totalAlunos: 48
  }

  const atividadeSemanal = [
    { semana: "Semana 1", participacoes: 32 },
    { semana: "Semana 2", participacoes: 41 },
    { semana: "Semana 3", participacoes: 28 },
    { semana: "Semana 4", participacoes: 55 }
  ]

  const premiosRecentes = [
    { aluno: "Joana Silva", premio: "Team Player", pontos: 10, data: "05/10/2025" },
    { aluno: "Tiago Sousa", premio: "Innovation Hero", pontos: 15, data: "02/10/2025" },
    { aluno: "Marta Rocha", premio: "OnTime Legend", pontos: 8, data: "28/09/2025" }
  ]

  const disciplinas = [
    { nome: "Engenharia Informática", curso: "Licenciatura EI", equipas: 3 },
    { nome: "Bases de Dados", curso: "Licenciatura EI", equipas: 2 },
    { nome: "Gestão de Projetos", curso: "Licenciatura GE", equipas: 1 }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header com gradiente roxo */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium text-indigo-100">Dashboard do Professor</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Bem-vindo!
            </h1>
            <p className="text-indigo-100">
              Gestão de disciplinas, equipas e quizzes
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Users className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Disciplinas</p>
              <p className="text-3xl font-bold text-blue-700">{stats.totalDisciplinas}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-500 opacity-20" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Quizzes Criados</p>
              <p className="text-3xl font-bold text-purple-700">{stats.totalQuizzes}</p>
            </div>
            <ClipboardList className="w-12 h-12 text-purple-500 opacity-20" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Equipas</p>
              <p className="text-3xl font-bold text-green-700">{stats.totalEquipas}</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-20" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium mb-1">Alunos</p>
              <p className="text-3xl font-bold text-amber-700">{stats.totalAlunos}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-amber-500 opacity-20" />
          </CardContent>
        </Card>

      </div>

      {/* Gráfico */}
      <Card className="mb-8 shadow-sm">
        <CardHeader>
          <CardTitle>Participação dos Alunos (Últimas Semanas)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={atividadeSemanal}>
              <XAxis dataKey="semana" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="participacoes" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Últimos prémios */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Últimos Prémios Atribuídos</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4">
            {premiosRecentes.map((p, i) => (
              <li key={i} className="border-b border-gray-100 pb-3 last:border-none">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-violet-700">{p.premio}</p>
                    <p className="text-sm text-gray-600">{p.aluno}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-violet-600">+{p.pontos} pts</p>
                    <p className="text-xs text-gray-400">{p.data}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disciplinas */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Disciplinas</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 font-semibold text-gray-700">Disciplina</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Curso</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Equipas</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {disciplinas.map((d, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{d.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{d.curso}</td>
                    <td className="px-6 py-4 text-gray-600">{d.equipas}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Gerir Equipas</Button>
                        <Button variant="outline" size="sm">Ver Quizzes</Button>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                          Criar Quiz
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}