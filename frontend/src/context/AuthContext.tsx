import { createContext, useContext, useMemo, useState } from "react"
import { login as doLogin, registerUser, saveSession, clearSession, getCurrentUser } from "@/services/auth"
import type { User } from "@/services/auth"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (p: { nome: string; email: string; password: string; papelSistema: "ALUNO" | "PROFESSOR" }) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 🔒 Corrigido: inicializa de forma segura
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    async signIn(email, password) {
      const data = await doLogin({ email, password })
      saveSession(data)
      setUser(data.user)
    },
    async signUp(p) {
      const data = await registerUser(p)
      saveSession(data)
      setUser(data.user)
    },
    signOut() {
      clearSession()
      setUser(null)
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
