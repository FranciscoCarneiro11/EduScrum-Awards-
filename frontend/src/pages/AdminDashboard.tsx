import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, GraduationCap, TrendingUp, Plus, Edit, Trash2, Sparkles, Shield } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import axios from 'axios'

export default function AdminDashboard() {
  const [cursos, setCursos] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalCursos: 0,
    totalProfessores: 0,
    totalAlunos: 0,
    totalProjetos: 8
  })
  const [cursoEditar, setCursoEditar] = useState<any | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [novoCurso, setNovoCurso] = useState({ nome: '', codigo: '' })

  const handleUpdateCurso = async () => {
    try {
      await axios.put(`/api/cursos/${cursoEditar.id}`, {
        nome: cursoEditar.nome,
        codigo: cursoEditar.codigo,
        adminId: cursoEditar.adminId
      })

      const res = await axios.get('/api/cursos')
      setCursos(res.data)

      setCursoEditar(null)
      setShowCreateModal(false)
      setNovoCurso({ nome: "", codigo: "" })

    } catch (error) {
      console.error("Erro ao editar curso:", error)
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const cursosRes = await axios.get('/api/cursos')
        const cursosData = cursosRes.data

        const usersRes = await axios.get('/api/utilizadores')
        const users = usersRes.data

        const totalAlunos = users.filter((u: any) => u.papelSistema === 'ALUNO').length
        const totalProfessores = users.filter((u: any) => u.papelSistema === 'PROFESSOR').length

        setCursos(
          cursosData.map((c: any) => ({
            ...c,
            numAlunos: 0,
            numProfessores: 0,
          }))
        )

        setStats(prev => ({
          ...prev,
          totalCursos: cursosData.length,
          totalAlunos,
          totalProfessores
        }))

      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      }
    }

    loadData()
  }, [])

  const handleCreateCurso = async () => {
    try {
      await axios.post('/api/cursos', {
        nome: novoCurso.nome,
        codigo: novoCurso.codigo,
        adminId: 7
      })

      setShowCreateModal(false)
      setNovoCurso({ nome: '', codigo: '' })

      const res = await axios.get('/api/cursos')
      setCursos(res.data)

      setStats(prev => ({
        ...prev,
        totalCursos: res.data.length
      }))
    } catch (err) {
      console.error('Erro ao criar curso:', err)
    }
  }

  const handleDeleteCurso = async (id: number) => {
    if (!confirm('Tem certeza que deseja eliminar este curso?')) return

    try {
      await axios.delete(`/api/cursos/${id}`)

      const res = await axios.get('/api/cursos')
      setCursos(res.data)

      setStats(prev => ({
        ...prev,
        totalCursos: res.data.length
      }))
    } catch (err) {
      console.error('Erro ao eliminar curso:', err)
    }
  }

  const dadosCrescimento = [
    { mes: 'Jan', alunos: 80, professores: 8 },
    { mes: 'Fev', alunos: 85, professores: 9 },
    { mes: 'Mar', alunos: 95, professores: 10 },
    { mes: 'Abr', alunos: 105, professores: 11 },
    { mes: 'Mai', alunos: 115, professores: 12 }
  ]

  const dadosAtividade = [
    { curso: 'EI', projetos: 4 },
    { curso: 'GE', projetos: 2 },
    { curso: 'DM', projetos: 2 }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium text-indigo-100">Área do Administrador</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Bem-vindo!
            </h1>
            <p className="text-indigo-100">
              Aqui pode gerir todos os cursos e visualizar estatísticas do sistema
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Shield className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Total de Cursos</p>
                <p className="text-3xl font-bold text-blue-700">{stats.totalCursos}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Professores</p>
                <p className="text-3xl font-bold text-purple-700">{stats.totalProfessores}</p>
              </div>
              <Users className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Alunos</p>
                <p className="text-3xl font-bold text-green-700">{stats.totalAlunos}</p>
              </div>
              <GraduationCap className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">Projetos Ativos</p>
                <p className="text-3xl font-bold text-orange-700">{stats.totalProjetos}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle>Crescimento de Utilizadores</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dadosCrescimento}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="alunos" stroke="#8b5cf6" strokeWidth={2} name="Alunos" />
                <Line type="monotone" dataKey="professores" stroke="#06b6d4" strokeWidth={2} name="Professores" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle>Projetos por Curso</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosAtividade}>
                <XAxis dataKey="curso" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="projetos" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gestão de Cursos */}
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Gestão de Cursos</CardTitle>
            <Button
              onClick={() => {
                setCursoEditar(null)
                setNovoCurso({ nome: "", codigo: "" })
                setShowCreateModal(true)
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2 text-white" />
              Novo Curso
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-4 font-semibold text-gray-700">Curso</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Código</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Alunos</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-center">Professores</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {cursos.map((curso) => (
                  <tr key={curso.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="font-medium text-gray-800">{curso.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {curso.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">0</td>
                    <td className="px-6 py-4 text-center text-gray-600">0</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCursoEditar(curso)
                            setShowCreateModal(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCurso(curso.id)}
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Criar/Editar Curso */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white shadow-xl rounded-xl border border-gray-200">
            <CardHeader>
              <CardTitle>
                {cursoEditar ? "Editar Curso" : "Criar Novo Curso"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Curso
                </label>
                <input
                  type="text"
                  value={cursoEditar ? cursoEditar.nome : novoCurso.nome}
                  onChange={(e) => {
                    if (cursoEditar) {
                      setCursoEditar({ ...cursoEditar, nome: e.target.value })
                    } else {
                      setNovoCurso({ ...novoCurso, nome: e.target.value })
                    }
                  }}
                  placeholder="Ex: Engenharia Informática"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-violet-400 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código do Curso
                </label>
                <input
                  type="text"
                  value={cursoEditar ? cursoEditar.codigo : novoCurso.codigo}
                  onChange={(e) => {
                    if (cursoEditar) {
                      setCursoEditar({ ...cursoEditar, codigo: e.target.value })
                    } else {
                      setNovoCurso({ ...novoCurso, codigo: e.target.value })
                    }
                  }}
                  placeholder="Ex: EI2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-violet-400 focus:outline-none bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setShowCreateModal(false)
                    setCursoEditar(null)
                    setNovoCurso({ nome: "", codigo: "" })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={cursoEditar ? handleUpdateCurso : handleCreateCurso}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {cursoEditar ? "Guardar Alterações" : "Criar Curso"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}