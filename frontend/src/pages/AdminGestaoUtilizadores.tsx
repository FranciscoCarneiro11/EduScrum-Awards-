import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"

type Papel = "ALUNO" | "PROFESSOR" | "ADMIN"

type Utilizador = {
  id: number
  nome: string
  email: string
  papelSistema: Papel
}

type Curso = {
  id: number
  nome: string
  codigo: string
  adminId?: number
}

type CursosPorUserMap = Record<number, Curso | null>

export default function AdminGestaoUtilizadores() {
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [cursosPorUser, setCursosPorUser] = useState<CursosPorUserMap>({})
  const [loading, setLoading] = useState(true)
  const [loadingAcao, setLoadingAcao] = useState<number | null>(null)

  const [modalAberto, setModalAberto] = useState(false)
  const [userSelecionado, setUserSelecionado] = useState<Utilizador | null>(null)
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState<number | "">("")

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setLoading(true)

      const [usersRes, cursosRes] = await Promise.all([
        api.get<Utilizador[]>("/api/utilizadores"),
        api.get<Curso[]>("/api/cursos"),
      ])

      setUtilizadores(usersRes.data)
      setCursos(cursosRes.data)

      const apenasAlunosProf = usersRes.data.filter(
        u => u.papelSistema === "ALUNO" || u.papelSistema === "PROFESSOR"
      )

      const associacoes = await Promise.all(
        apenasAlunosProf.map(async (u) => {
          try {
            const base =
              u.papelSistema === "ALUNO" ? "/api/alunos" : "/api/professores"
            const res = await api.get<Curso[]>(`${base}/${u.id}/cursos`)
            const curso = res.data[0] ?? null
            return [u.id, curso] as const
          } catch (err) {
            console.error("Erro a carregar curso de utilizador", u.id, err)
            return [u.id, null] as const
          }
        })
      )

      const map: CursosPorUserMap = {}
      associacoes.forEach(([id, curso]) => {
        map[id] = curso
      })
      setCursosPorUser(map)
    } catch (err) {
      console.error("Erro ao carregar dados de gestão:", err)
    } finally {
      setLoading(false)
    }
  }

  const alunos = utilizadores.filter(u => u.papelSistema === "ALUNO")
  const professores = utilizadores.filter(u => u.papelSistema === "PROFESSOR")

  // Abrir modal para atribuir curso
  const abrirModal = (user: Utilizador) => {
    setUserSelecionado(user)
    const cursoAtual = cursosPorUser[user.id]
    setCursoSelecionadoId(cursoAtual ? cursoAtual.id : "")
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setUserSelecionado(null)
    setCursoSelecionadoId("")
  }

  // Confirmar atribuição de curso
  const confirmarAtribuicao = async () => {
    if (!userSelecionado || !cursoSelecionadoId) return

    try {
      setLoadingAcao(userSelecionado.id)

      const base =
        userSelecionado.papelSistema === "ALUNO"
          ? "/api/alunos"
          : "/api/professores"

      await api.post(
        `${base}/${userSelecionado.id}/cursos/${cursoSelecionadoId}`
      )

      const curso = cursos.find(c => c.id === cursoSelecionadoId) ?? null

      setCursosPorUser(prev => ({
        ...prev,
        [userSelecionado.id]: curso,
      }))

      fecharModal()
    } catch (err) {
      console.error("Erro ao atribuir curso:", err)
      alert("Ocorreu um erro ao atribuir o curso.")
    } finally {
      setLoadingAcao(null)
    }
  }

  // Remover curso atual
  const removerCurso = async (user: Utilizador) => {
    const cursoAtual = cursosPorUser[user.id]
    if (!cursoAtual) return

    try {
      setLoadingAcao(user.id)

      const base =
        user.papelSistema === "ALUNO"
          ? "/api/alunos"
          : "/api/professores"

      await api.delete(
        `${base}/${user.id}/cursos/${cursoAtual.id}`
      )

      setCursosPorUser(prev => ({
        ...prev,
        [user.id]: null,
      }))
    } catch (err) {
      console.error("Erro ao remover curso:", err)
      alert("Ocorreu um erro ao remover o curso.")
    } finally {
      setLoadingAcao(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar gestão de utilizadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Gestão de Utilizadores
      </h1>

      {/* ALUNOS */}
      <Card className="mb-8 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Alunos</h2>
            <span className="text-sm text-gray-500">
              Total: {alunos.length}
            </span>
          </div>

          {alunos.length === 0 ? (
            <p className="text-gray-500 text-sm">Ainda não existem alunos registados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 pr-4">Nome</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Curso Atual</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map(aluno => {
                    const cursoAtual = cursosPorUser[aluno.id]
                    const emLoading = loadingAcao === aluno.id

                    return (
                      <tr key={aluno.id} className="border-b last:border-none">
                        <td className="py-2 pr-4">{aluno.nome}</td>
                        <td className="py-2 pr-4 text-gray-600">{aluno.email}</td>
                        <td className="py-2 pr-4">
                          {cursoAtual ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-violet-50 text-violet-700 text-xs">
                              {cursoAtual.nome} ({cursoAtual.codigo})
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Sem curso associado
                            </span>
                          )}
                        </td>
                        <td className="py-2 flex flex-wrap gap-2">
                          <button
                            className="px-3 py-1 rounded-lg text-xs bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-60"
                            disabled={emLoading}
                            onClick={() => abrirModal(aluno)}
                          >
                            {emLoading ? "A processar..." : "Atribuir curso"}
                          </button>
                          <button
                            className="px-3 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-60"
                            disabled={emLoading || !cursoAtual}
                            onClick={() => removerCurso(aluno)}
                          >
                            Remover curso
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PROFESSORES */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Professores</h2>
            <span className="text-sm text-gray-500">
              Total: {professores.length}
            </span>
          </div>

          {professores.length === 0 ? (
            <p className="text-gray-500 text-sm">Ainda não existem professores registados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-2 pr-4">Nome</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Curso Atual</th>
                    <th className="py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {professores.map(prof => {
                    const cursoAtual = cursosPorUser[prof.id]
                    const emLoading = loadingAcao === prof.id

                    return (
                      <tr key={prof.id} className="border-b last:border-none">
                        <td className="py-2 pr-4">{prof.nome}</td>
                        <td className="py-2 pr-4 text-gray-600">{prof.email}</td>
                        <td className="py-2 pr-4">
                          {cursoAtual ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-violet-50 text-violet-700 text-xs">
                              {cursoAtual.nome} ({cursoAtual.codigo})
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Sem curso associado
                            </span>
                          )}
                        </td>
                        <td className="py-2 flex flex-wrap gap-2">
                          <button
                            className="px-3 py-1 rounded-lg text-xs bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-60"
                            disabled={emLoading}
                            onClick={() => abrirModal(prof)}
                          >
                            {emLoading ? "A processar..." : "Atribuir curso"}
                          </button>
                          <button
                            className="px-3 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-60"
                            disabled={emLoading || !cursoAtual}
                            onClick={() => removerCurso(prof)}
                          >
                            Remover curso
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL ATRIBUIR CURSO */}
      {modalAberto && userSelecionado && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Atribuir curso a {userSelecionado.nome}
            </h3>

            <label className="block text-sm text-gray-600 mb-1">
              Seleciona o curso
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={cursoSelecionadoId}
              onChange={e =>
                setCursoSelecionadoId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <option value="">-- Escolha um curso --</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome} ({curso.codigo})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                onClick={fecharModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-60"
                disabled={!cursoSelecionadoId}
                onClick={confirmarAtribuicao}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
