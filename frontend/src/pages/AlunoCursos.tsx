import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"
import { useNavigate } from "react-router-dom"

type Curso = {
  id: number
  nome: string
  codigo: string
  adminId: number
}

export default function AlunoCursos() {
  const { user } = useAuth()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()  

  useEffect(() => {
    if (!user) return setLoading(false)

    async function carregarCursos() {
      try {
        const res = await api.get(`/api/alunos/${user?.id}/cursos`)
        setCursos(res.data)
      } catch (err) {
        console.error("Erro ao carregar cursos:", err)
      } finally {
        setLoading(false)
      }
    }

    carregarCursos()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">A carregar cursos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-900">
        Os meus Cursos
      </h1>

      <p className="text-gray-600 mt-1">
        Olá, <span className="font-semibold">{user?.nome}</span> — aqui estão os cursos aos quais estás associado(a).
      </p>

      {/* Se não tiver cursos */}
      {cursos.length === 0 && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold text-gray-800">Ainda não estás associado(a) a nenhum curso</h2>
          <p className="text-gray-600 mt-2">Contacta o administrador ou aguarda atribuição.</p>
        </div>
      )}

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {cursos.map((curso) => (
          <div key={curso.id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold text-gray-900">{curso.nome}</h3>
            <p className="text-gray-600 mt-1">Código: {curso.codigo}</p>

            <button
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              onClick={() => navigate(`/aluno/cursos/${curso.id}`)} 
            >
              Entrar no Curso
              
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
