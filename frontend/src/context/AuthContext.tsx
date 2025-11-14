import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { fetchCurrentUser, saveSession, clearSession, login as apiLogin } from "@/services/auth"
import type { User } from "@/services/auth"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    console.log("🔍 AuthContext useEffect - A verificar token...")
    const token = localStorage.getItem("auth_token")
    
    if (token) {
      console.log("Token encontrado, a buscar utilizador...")
      fetchCurrentUser()
        .then(u => {
          console.log("Utilizador carregado:", u)
          setUser(u)
          setIsAuthenticated(true)
        })
        .catch(err => {
          console.error("Erro ao buscar utilizador:", err)
          clearSession()
          setUser(null)
          setIsAuthenticated(false)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      console.log("Sem token no localStorage")
      setIsLoading(false)
    }
  }, [])

  // Login
  const login = async (email: string, password: string): Promise<User> => {
    console.log("Login chamado com:", email)
    const data = await apiLogin({ email, password })
    console.log("Login bem-sucedido:", data)
    
    saveSession(data)
    
    const newUser: User = {
      nome: data.nome,
      email: data.email,
      papelSistema: data.papelSistema
    }
    
    setUser(newUser)
    setIsAuthenticated(true)
    console.log("Estado atualizado - isAuthenticated: true, user:", newUser)
    return newUser
  }

  // Logout
  const logout = () => {
    console.log("Logout chamado")
    clearSession()
    setUser(null)
    setIsAuthenticated(false)
  }

  console.log("AuthContext render - isAuthenticated:", isAuthenticated, "user:", user, "isLoading:", isLoading)

  // Mostrar loading enquanto verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-violet-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
