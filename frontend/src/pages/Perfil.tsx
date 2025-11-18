import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  User, Mail, Shield, Trophy, Star, FolderOpen,
  BookOpen, Users, KanbanSquare, Lock, Bell, Moon
} from "lucide-react"

export default function Perfil() {
  const { user } = useAuth()
  const isProfessor = user?.papelSistema === "PROFESSOR"

  // Preferências locais
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)

  // Dados simulados (substituir por API mais tarde)
  const quickStatsAluno = [
    { label: "Pontos", value: 320, icon: Trophy, color: "text-violet-600" },
    { label: "Prémios", value: 5, icon: Star, color: "text-yellow-500" },
    { label: "Projetos Ativos", value: 2, icon: FolderOpen, color: "text-green-600" },
  ]

  const quickStatsProfessor = [
    { label: "Cursos", value: 3, icon: BookOpen, color: "text-violet-600" },
    { label: "Equipas", value: 7, icon: Users, color: "text-blue-600" },
    { label: "Projetos", value: 4, icon: KanbanSquare, color: "text-emerald-600" },
  ]

  // Avatar básico com iniciais
  const initials = (user?.nome || "Utilizador")
    .split(" ")
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join("")

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xl">
          {initials || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            Meu Perfil
          </h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Resumo Rápido (varia por papel) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {(isProfessor ? quickStatsProfessor : quickStatsAluno).map((s, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`${s.color}`} />
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-xl font-semibold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" /> Nome
              </Label>
              <p className="text-lg font-medium text-gray-800">{user?.nome}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <p className="text-lg font-medium text-gray-800">{user?.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Tipo de conta
              </Label>
              <p className="text-lg font-medium text-gray-800">
                {isProfessor ? "Professor" : "Aluno"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Segurança da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Segurança da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Mantém a tua conta segura ao atualizar a password regularmente.
            </p>
            <button
              type="button"
              className="w-full py-2 rounded-lg bg-violet-600 text-white font-medium hover:opacity-90 transition"
              onClick={() => alert("Em breve: modal para alterar password")}
            >
              Alterar password
            </button>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Preferências
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Tema escuro</p>
                  <p className="text-sm text-gray-500">Usar interface em modo escuro</p>
                </div>
              </div>
              <button
                className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-violet-600 text-white" : "bg-gray-100"}`}
                onClick={() => setDarkMode(v => !v)}
              >
                {darkMode ? "Ativo" : "Inativo"}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Notificações por email</p>
                  <p className="text-sm text-gray-500">Receber alertas sobre prémios e atividade</p>
                </div>
              </div>
              <button
                className={`px-3 py-1 rounded-full text-sm ${emailNotifs ? "bg-violet-600 text-white" : "bg-gray-100"}`}
                onClick={() => setEmailNotifs(v => !v)}
              >
                {emailNotifs ? "Ativo" : "Inativo"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
