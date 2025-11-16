package com.eduscrum.awards.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eduscrum.awards.model.Curso;
import com.eduscrum.awards.model.CursoResponseDTO;
import com.eduscrum.awards.service.ProfessorCursoService;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "*")
public class ProfessorCursoController {

    private final ProfessorCursoService professorCursoService;

    public ProfessorCursoController(ProfessorCursoService professorCursoService) {
        this.professorCursoService = professorCursoService;
    }

    @PostMapping("/{professorId}/cursos/{cursoId}")
    public ResponseEntity<Void> associarProfessorAoCurso(@PathVariable Long professorId,
                                                         @PathVariable Long cursoId) {
        professorCursoService.adicionarProfessorAoCurso(professorId, cursoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{professorId}/cursos")
    public ResponseEntity<List<CursoResponseDTO>> listarCursosDoProfessor(@PathVariable Long professorId) {
        List<Curso> cursos = professorCursoService.listarCursosDoProfessor(professorId);

        List<CursoResponseDTO> cursosDTO = cursos.stream()
                .map(CursoResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(cursosDTO);
    }

    @DeleteMapping("/{professorId}/cursos/{cursoId}")
    public ResponseEntity<Void> removerProfessorDoCurso(@PathVariable Long professorId,
                                                        @PathVariable Long cursoId) {
        professorCursoService.removerProfessorDoCurso(professorId, cursoId);
        return ResponseEntity.noContent().build();
    }
}
