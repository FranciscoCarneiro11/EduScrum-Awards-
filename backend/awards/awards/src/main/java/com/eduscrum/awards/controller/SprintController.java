package com.eduscrum.awards.controller;

import com.eduscrum.awards.model.SprintDTO;
import com.eduscrum.awards.service.SprintService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SprintController {

    private final SprintService sprintService;

    public SprintController(SprintService sprintService) {
        this.sprintService = sprintService;
    }

    //Método para criar um novo Sprint
    @PostMapping("/projetos/{projetoId}/sprints")
    @ResponseStatus(HttpStatus.CREATED)
    public SprintDTO criarSprint(@PathVariable Long projetoId, @RequestBody SprintDTO dto) {
        return sprintService.criar(projetoId, dto);
    }

    //Método para listar Sprints por Projeto
    @GetMapping("/projetos/{projetoId}/sprints")
    public List<SprintDTO> listarSprints(@PathVariable Long projetoId) {
        return sprintService.listarPorProjeto(projetoId);
    }
    
    //Método para apagar um Sprint
    @DeleteMapping("/sprints/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagarSprint(@PathVariable Long id) {
        sprintService.apagar(id);
    }
}