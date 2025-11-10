import api from "@/lib/api"

// Tipo do utilizador
export type User = {
  nome: string
  email: string
  papelSistema: "ALUNO" | "PROFESSOR" 
}

// Tipos para login e registo
type LoginPayload = { email: string; password: string }
type RegisterPayload = {
  nome: string
  email: string
  password: string
  papelSistema: "ALUNO" | "PROFESSOR"
}

// Respostas do backend
type AuthResponse = {
  token: string
  nome: string
  email: string
  papelSistema: "ALUNO" | "PROFESSOR" 
}

// LOGIN
export async function login(data: LoginPayload) {
  const res = await api.post<AuthResponse>("/api/auth/login", data)
  return res.data
}

// REGISTO
export async function registerUser(data: RegisterPayload) {
  const res = await api.post<AuthResponse>("/api/auth/register", {
    nome: data.nome,
    email: data.email,
    password: data.password,
    papelSistema: data.papelSistema.toUpperCase(),
  })
  return res.data
}

// Obter utilizador autenticado do backend
export async function fetchCurrentUser(): Promise<User> {
  const res = await api.get<User>("/api/utilizadores/me")
  return res.data
}

// GESTÃO DE SESSÃO LOCAL
export function saveSession(response: AuthResponse) {
  localStorage.setItem("auth_token", response.token)
  
  const user: User = {
    nome: response.nome,
    email: response.email,
    papelSistema: response.papelSistema
  }
  localStorage.setItem("user", JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("user")
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem("user")
  return raw ? (JSON.parse(raw) as User) : null
}