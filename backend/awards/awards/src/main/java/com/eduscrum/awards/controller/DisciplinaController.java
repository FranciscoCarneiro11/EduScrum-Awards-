package com.eduscrum.awards.controller;

import com.eduscrum.awards.model.Disciplina;
import com.eduscrum.awards.model.DisciplinaDTO;
import com.eduscrum.awards.service.DisciplinaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos/{cursoId}/disciplinas")
@CrossOrigin(origins = "*")
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    // Criar disciplina num curso
    @PostMapping
    public ResponseEntity<Disciplina> criarDisciplina(
            @PathVariable Long cursoId,
            @RequestBody DisciplinaDTO disciplinaDTO) {

        Disciplina disciplina = disciplinaService.criarDisciplina(cursoId, disciplinaDTO);
        return ResponseEntity.ok(disciplina);
    }

    // Listar disciplinas de um curso
    @GetMapping
    public List<Disciplina> listarDisciplinas(@PathVariable Long cursoId) {
        return disciplinaService.listarPorCurso(cursoId);
    }

    // Atualizar disciplina
    @PutMapping("/{disciplinaId}")
    public ResponseEntity<Disciplina> atualizarDisciplina(
            @PathVariable Long cursoId,
            @PathVariable Long disciplinaId,
            @RequestBody DisciplinaDTO disciplinaDTO) {

        // Nota: cursoId não é usado aqui, mas está na rota para ficar semântica:
        // /api/cursos/{cursoId}/disciplinas/{disciplinaId}
        Disciplina disciplina = disciplinaService.atualizarDisciplina(disciplinaId, disciplinaDTO);
        return ResponseEntity.ok(disciplina);
    }

    // Eliminar disciplina
    @DeleteMapping("/{disciplinaId}")
    public ResponseEntity<Void> eliminarDisciplina(
            @PathVariable Long cursoId,
            @PathVariable Long disciplinaId) {

        disciplinaService.eliminarDisciplina(disciplinaId);
        return ResponseEntity.noContent().build();
    }
}