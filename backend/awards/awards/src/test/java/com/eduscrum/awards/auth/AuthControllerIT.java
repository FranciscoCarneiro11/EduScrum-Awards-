package com.eduscrum.awards.auth;

import com.eduscrum.awards.repository.UtilizadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UtilizadorRepository utilizadorRepository;

  @BeforeEach
  void limparBaseDados() {
    utilizadorRepository.deleteAll();
  }

  @Test
  @DisplayName("Deve registar e autenticar utilizador com sucesso")
  void deveRegistarEAutenticarUtilizador() throws Exception {
    // REGISTO
    String registo = """
            {
              "nome": "Joao Silva",
              "email": "joao@test.com",
              "password": "senha123",
              "papelSistema": "ALUNO"
            }
        """;

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(registo))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andExpect(jsonPath("$.email").value("joao@test.com"))
        .andExpect(jsonPath("$.nome").value("Joao Silva"))
        .andExpect(jsonPath("$.papelSistema").value("ALUNO"));

    // LOGIN CORRETO
    String loginOk = """
            {
              "email": "joao@test.com",
              "password": "senha123"
            }
        """;

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(loginOk))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andExpect(jsonPath("$.email").value("joao@test.com"));

    // LOGIN ERRADO
    String loginErrado = """
            {
              "email": "joao@test.com",
              "password": "senhaErrada"
            }
        """;

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(loginErrado))
        .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Não deve registar utilizador com email duplicado")
  void naoDeveRegistarEmailDuplicado() throws Exception {
    // Primeiro registo
    String registo1 = """
            {
              "nome": "Maria Costa",
              "email": "maria@test.com",
              "password": "senha123",
              "papelSistema": "ALUNO"
            }
        """;

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(registo1))
        .andExpect(status().isOk());

    // Segundo registo com mesmo email
    String registo2 = """
            {
              "nome": "Maria Silva",
              "email": "maria@test.com",
              "password": "outraSenha",
              "papelSistema": "PROFESSOR"
            }
        """;

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(registo2))
        .andExpect(status().isBadRequest())
        .andExpect(content().string(org.hamcrest.Matchers.containsString("Email já registado")));
  }

  @Test
  @DisplayName("Não deve fazer login com email inexistente")
  void naoDeveFazerLoginComEmailInexistente() throws Exception {
    String login = """
            {
              "email": "naoexiste@test.com",
              "password": "qualquerSenha"
            }
        """;

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(login))
        .andExpect(status().isUnauthorized())
        .andExpect(content().string(org.hamcrest.Matchers.containsString("Email não encontrado")));
  }

  @Test
  @DisplayName("Deve registar professor com sucesso")
  void deveRegistarProfessorComSucesso() throws Exception {
    String registoProfessor = """
            {
              "nome": "Prof. Carlos",
              "email": "carlos@test.com",
              "password": "prof123",
              "papelSistema": "PROFESSOR"
            }
        """;

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(registoProfessor))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.papelSistema").value("PROFESSOR"));
  }

  @Test
  @DisplayName("Deve registar admin com sucesso")
  void deveRegistarAdminComSucesso() throws Exception {
    String registoAdmin = """
            {
              "nome": "Admin Sistema",
              "email": "admin@test.com",
              "password": "admin123",
              "papelSistema": "ADMIN"
            }
        """;

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(registoAdmin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.papelSistema").value("ADMIN"));
  }

  @Test
  @DisplayName("Não deve registar sem password")
  void naoDeveRegistarSemPassword() throws Exception {
    String registoSemSenha = """
            {
              "nome": "Teste Sem Senha",
              "email": "teste@test.com",
              "papelSistema": "ALUNO"
            }
        """;

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(registoSemSenha))
        .andExpect(status().isBadRequest())
        .andExpect(content().string(org.hamcrest.Matchers.containsString("Password é obrigatória")));
  }
}