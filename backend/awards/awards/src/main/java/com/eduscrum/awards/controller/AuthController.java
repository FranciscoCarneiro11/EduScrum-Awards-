package com.eduscrum.awards.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduscrum.awards.model.Aluno;
import com.eduscrum.awards.model.PapelSistema;
import com.eduscrum.awards.model.Professor;
import com.eduscrum.awards.model.Utilizador;
import com.eduscrum.awards.model.UtilizadorDTO;
import com.eduscrum.awards.repository.UtilizadorRepository;
import com.eduscrum.awards.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // permite pedidos do frontend
public class AuthController {

    @Autowired private UtilizadorRepository utilizadorRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    // Modelo simples para o pedido de login
    public static class LoginRequest {
        public String email;
        public String password;
    }

    // Modelo simples para a resposta
    public static class LoginResponse {
        public String token;
        public String email;
        public String papelSistema;

        public LoginResponse(String token, String email, String papelSistema) {
            this.token = token;
            this.email = email;
            this.papelSistema = papelSistema;
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Utilizador> userOpt = utilizadorRepository.findByEmail(request.email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Email não encontrado");
        }

        Utilizador user = userOpt.get();

        if (!passwordEncoder.matches(request.password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Senha incorreta");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.getPapelSistema().name()));
    }

    // REGISTO
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UtilizadorDTO novoDTO) {
        // verificar se já existe
        if (utilizadorRepository.findByEmail(novoDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já registado");
        }

        // Validar se password não é nula
        if (novoDTO.getPassword() == null || novoDTO.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password é obrigatória");
        }

        // encriptar password
        String passwordHash = passwordEncoder.encode(novoDTO.getPassword());

        // definir papel padrão
        PapelSistema papelSistema = novoDTO.getPapelSistema() != null ? 
                                    novoDTO.getPapelSistema() : PapelSistema.ALUNO;

        Utilizador utilizadorASalvar;

        // Criação conforme o papelSistema
        if (papelSistema == PapelSistema.ALUNO) {
            Aluno aluno = new Aluno();
            aluno.setNome(novoDTO.getNome());
            aluno.setEmail(novoDTO.getEmail());
            aluno.setPasswordHash(passwordHash);
            aluno.setPapelSistema(PapelSistema.ALUNO);
            utilizadorASalvar = aluno;
        } else if (papelSistema == PapelSistema.PROFESSOR) {
            Professor prof = new Professor();
            prof.setNome(novoDTO.getNome());
            prof.setEmail(novoDTO.getEmail());
            prof.setPasswordHash(passwordHash);
            prof.setPapelSistema(PapelSistema.PROFESSOR);
            utilizadorASalvar = prof;
        } else {
            Utilizador u = new Utilizador();
            u.setNome(novoDTO.getNome());
            u.setEmail(novoDTO.getEmail());
            u.setPasswordHash(passwordHash);
            u.setPapelSistema(papelSistema);
            utilizadorASalvar = u;
        }

        Utilizador saved = utilizadorRepository.save(utilizadorASalvar);

        // criar token JWT
        String token = jwtUtil.generateToken(saved.getEmail());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "email", saved.getEmail(),
            "papelSistema", saved.getPapelSistema().name()
        ));
    }
}
