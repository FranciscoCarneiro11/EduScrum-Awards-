package com.eduscrum.awards.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eduscrum.awards.model.Curso;
import com.eduscrum.awards.model.CursoDTO;
import com.eduscrum.awards.service.CursoService;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    // Listar todos os cursos
    @GetMapping
    public ResponseEntity<List<Curso>> listarCursos() {
        List<Curso> cursos = cursoService.listarCursos();
        return ResponseEntity.ok(cursos);
    }

    // Obter curso por ID
    @GetMapping("/{id}")
    public ResponseEntity<Curso> obterCursoPorId(@PathVariable Long id) {
        Curso curso = cursoService.obterCursoPorId(id);
        return ResponseEntity.ok(curso);
    }

    // Criar novo curso
    @PostMapping
    public ResponseEntity<Curso> criarCurso(@RequestBody CursoDTO cursoDTO) {
        Curso curso = cursoService.criarCurso(cursoDTO);
        return ResponseEntity.ok(curso);
    }

    // Atualizar curso
    @PutMapping("/{id}")
    public ResponseEntity<Curso> atualizarCurso(@PathVariable Long id, @RequestBody CursoDTO cursoDTO) {
        Curso curso = cursoService.atualizarCurso(id, cursoDTO);
        return ResponseEntity.ok(curso);
    }

    // Eliminar curso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCurso(@PathVariable Long id) {
        cursoService.eliminarCurso(id);
        return ResponseEntity.noContent().build();
    }
}