package com.eduscrum.awards.controller;

import com.eduscrum.awards.model.CursoDTO;
import com.eduscrum.awards.service.ProfessorCursoService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "*")
public class ProfessorCursoController {

    private final ProfessorCursoService service;

    public ProfessorCursoController(ProfessorCursoService service) {
        this.service = service;
    }

    @GetMapping("/{professorId}/cursos")
    public List<CursoDTO> listarCursos(@PathVariable Long professorId) {
        return service.listarCursosDoProfessor(professorId);
    }

    @PostMapping("/{professorId}/cursos/{cursoId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void associar(@PathVariable Long professorId, @PathVariable Long cursoId) {
        service.associarProfessorACurso(professorId, cursoId);
    }

    @DeleteMapping("/{professorId}/cursos/{cursoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desassociar(@PathVariable Long professorId, @PathVariable Long cursoId) {
        service.desassociarProfessorDeCurso(professorId, cursoId);
    }

    // ENDPOINT: DOWNLOAD CSV
    @GetMapping("/cursos/{cursoId}/exportar")
    public ResponseEntity<byte[]> exportarNotas(@PathVariable Long cursoId) {
        byte[] csvData = service.exportarNotasCsv(cursoId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "pauta_curso_" + cursoId + ".csv");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return new ResponseEntity<>(csvData, headers, HttpStatus.OK);
    }
}