package com.eduscrum.awards.curso;

import com.eduscrum.awards.model.Admin;
import com.eduscrum.awards.model.PapelSistema;
import com.eduscrum.awards.repository.AdminRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.hasItems;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CursoControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AdminRepository adminRepository;


    @Test
    @DisplayName("Deve criar um curso com sucesso")
    void deveCriarCursoComSucesso() throws Exception {
        // Criar um admin 
        Admin admin = new Admin();
        admin.setNome("Admin Teste");
        admin.setEmail("admin@test.com");
        admin.setPasswordHash("senha_teste"); 
        admin.setPapelSistema(PapelSistema.ADMIN);
        admin = adminRepository.save(admin);

        // JSON da requisição com o adminId criado em cima
        String novoCursoJson = """
            {
              "nome": "Curso de Teste",
              "codigo": "CURSO_TESTE",
              "adminId": %d
            }
            """.formatted(admin.getId());

        // Chamar POST /api/cursos e validar o resultado
        mockMvc.perform(post("/api/cursos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(novoCursoJson))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.nome").value("Curso de Teste"))
                .andExpect(jsonPath("$.codigo").value("CURSO_TESTE"));
    }

    @Test
    @DisplayName("Não deve permitir criar curso com código duplicado")
    void naoDeveCriarCursoComCodigoDuplicado() throws Exception {
        Admin admin = new Admin();
        admin.setNome("Admin Teste 2");
        admin.setEmail("admin2@test.com");
        admin.setPasswordHash("123");
        admin.setPapelSistema(PapelSistema.ADMIN);
        admin = adminRepository.save(admin);

        String cursoJson = """
            {
            "nome": "Curso Original",
            "codigo": "CODIGO_DUP",
            "adminId": %d
            }
            """.formatted(admin.getId());

        // criar curso com sucesso
        mockMvc.perform(post("/api/cursos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(cursoJson))
                .andExpect(status().isOk());

        String cursoDuplicadoJson = """
            {
            "nome": "Outro Curso",
            "codigo": "CODIGO_DUP",
            "adminId": %d
            }
            """.formatted(admin.getId());

        // criar duplicado 
        assertThrows(Exception.class, () -> {
            mockMvc.perform(post("/api/cursos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(cursoDuplicadoJson))
                    .andReturn();
        });
    }

    @Test
    @DisplayName("Deve listar todos os cursos")
    void deveListarCursos() throws Exception {
        // Criar admin
        Admin admin = new Admin();
        admin.setNome("Admin Listagem");
        admin.setEmail("adminlist@test.com");
        admin.setPasswordHash("123");
        admin.setPapelSistema(PapelSistema.ADMIN);
        admin = adminRepository.save(admin);

        // Criar 2 cursos na BD
        String curso1Json = """
            {
            "nome": "Curso A",
            "codigo": "CURSO_A",
            "adminId": %d
            }
            """.formatted(admin.getId());

        String curso2Json = """
            {
            "nome": "Curso B",
            "codigo": "CURSO_B",
            "adminId": %d
            }
            """.formatted(admin.getId());

        mockMvc.perform(post("/api/cursos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(curso1Json))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/cursos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(curso2Json))
                .andExpect(status().isOk());

        // Testar listagem de cursos
        mockMvc.perform(get("/api/cursos")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[*].nome").value(hasItems("Curso A", "Curso B")));
    }


}
