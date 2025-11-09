package com.eduscrum.awards.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void deveRegistarEAutenticarUtilizador() throws Exception {
        // 1️⃣ Registo
        String registo = """
            {
              "nome": "Joao",
              "email": "joao@test.com",
              "passwordHash": "1234",
              "papelSistema": "STUDENT"
            }
        """;

        mockMvc.perform(post("/api/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registo))
                .andExpect(status().isOk());

        // 2️⃣ Login correto
        String loginOk = """
            {
              "email": "joao@test.com",
              "passwordHash": "1234"
            }
        """;

        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginOk))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("token")));

        // 3️⃣ Login errado
        String loginErrado = """
            {
              "email": "joao@test.com",
              "passwordHash": "errada"
            }
        """;

        mockMvc.perform(post("/api/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginErrado))
                .andExpect(status().isUnauthorized());
    }
}
