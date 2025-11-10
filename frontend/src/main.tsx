import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Perfil from "./pages/Perfil"
import Sobre from "./pages/Sobre"
import "./index.css"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas com Navbar e Footer (usa App como layout) */}
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="sobre" element={<Sobre />} />
            
            {/* Rotas protegidas */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rotas sem Navbar e Footer (login e register) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
<<<<<<< HEAD
)// chore: no-op commit
=======
)
>>>>>>> ef65f70 (WIP: trabalho local)
