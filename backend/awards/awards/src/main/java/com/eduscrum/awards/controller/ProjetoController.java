package com.eduscrum.awards.controller;

import com.eduscrum.awards.model.ProjetoDTO;
import com.eduscrum.awards.model.ProjetoRequestDTO;
import com.eduscrum.awards.service.ProjetoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProjetoController {

    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    // POST /api/cursos/{id}/projetos - Criar projeto num curso
    @PostMapping("/cursos/{cursoId}/projetos")
    public ResponseEntity<ProjetoDTO> criarProjeto(
            @PathVariable Long cursoId,
            @RequestBody ProjetoRequestDTO dto) {

        ProjetoDTO criado = projetoService.criarProjeto(cursoId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // GET /api/cursos/{id}/projetos - Listar projetos de um curso
    @GetMapping("/cursos/{cursoId}/projetos")
    public ResponseEntity<List<ProjetoDTO>> listarProjetosDoCurso(
            @PathVariable Long cursoId) {

        List<ProjetoDTO> projetos = projetoService.listarProjetosDoCurso(cursoId);
        return ResponseEntity.ok(projetos);
    }

    // GET /api/projetos/{id} - Detalhes do projeto
    @GetMapping("/projetos/{id}")
    public ResponseEntity<ProjetoDTO> obterProjeto(@PathVariable Long id) {
        ProjetoDTO dto = projetoService.obterProjeto(id);
        return ResponseEntity.ok(dto);
    }

    // PUT /api/projetos/{id} - Atualizar projeto
    @PutMapping("/projetos/{id}")
    public ResponseEntity<ProjetoDTO> atualizarProjeto(
            @PathVariable Long id,
            @RequestBody ProjetoRequestDTO dto) {

        ProjetoDTO atualizado = projetoService.atualizarProjeto(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    // DELETE /api/projetos/{id} - Eliminar projeto
    @DeleteMapping("/projetos/{id}")
    public ResponseEntity<Void> eliminarProjeto(@PathVariable Long id) {
        projetoService.eliminarProjeto(id);
        return ResponseEntity.noContent().build();
    }
}
