package com.eduscrum.awards.controller;

import com.eduscrum.awards.model.EquipaDTO;
import com.eduscrum.awards.model.EquipaCreateDTO;
import com.eduscrum.awards.model.EquipaUpdateDTO;
import com.eduscrum.awards.model.MembroEquipaDTO;
import com.eduscrum.awards.model.MembroEquipaCreateDTO;
import com.eduscrum.awards.service.EquipaService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipas")
@CrossOrigin(origins = "*")  
public class EquipaController {

    private final EquipaService service;

    public EquipaController(EquipaService service) {
        this.service = service;
    }

    // EQUIPAS
    @GetMapping
    public List<EquipaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public EquipaDTO obter(@PathVariable Long id) {
        return service.obter(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipaDTO criar(@Valid @RequestBody EquipaCreateDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public EquipaDTO atualizar(@PathVariable Long id, @Valid @RequestBody EquipaUpdateDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void apagar(@PathVariable Long id) {
        service.apagar(id);
    }

    //MEMBROS 
    @GetMapping("/{id}/membros")
    public List<MembroEquipaDTO> listarMembros(@PathVariable Long id) {
        return service.listarMembros(id);
    }

    @PostMapping("/{id}/membros")
    @ResponseStatus(HttpStatus.CREATED)
    public MembroEquipaDTO adicionarMembro(
            @PathVariable Long id,
            @Valid @RequestBody MembroEquipaCreateDTO dto) {
        return service.adicionarMembro(id, dto);
    }

    @DeleteMapping("/{id}/membros/{idUtilizador}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerMembro(@PathVariable Long id, @PathVariable Long idUtilizador) {
        service.removerMembro(id, idUtilizador);
    }
}