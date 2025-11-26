package com.eduscrum.awards.service;

import com.eduscrum.awards.model.Projeto;
import com.eduscrum.awards.model.Sprint;
import com.eduscrum.awards.model.SprintDTO;
import com.eduscrum.awards.repository.ProjetoRepository;
import com.eduscrum.awards.repository.SprintRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SprintService {

    private final SprintRepository sprintRepository;
    private final ProjetoRepository projetoRepository;

    public SprintService(SprintRepository sprintRepository, ProjetoRepository projetoRepository) {
        this.sprintRepository = sprintRepository;
        this.projetoRepository = projetoRepository;
    }

    //Método para criar um novo Sprint
    public SprintDTO criar(Long projetoId, SprintDTO dto) {
        Projeto projeto = projetoRepository.findById(projetoId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto não encontrado"));
        Sprint sprint = new Sprint(dto.getNome(), dto.getObjetivos(), dto.getDataInicio(), dto.getDataFim(), projeto);
        sprint = sprintRepository.save(sprint);
        return new SprintDTO(sprint);
    }

    //Método para listar Sprints por Projeto
    public List<SprintDTO> listarPorProjeto(Long projetoId) {
        return sprintRepository.findByProjetoId(projetoId).stream().map(SprintDTO::new).collect(Collectors.toList());
    }
    
    //Método para apagar um Sprint
    public void apagar(Long id) {
        if(!sprintRepository.existsById(id)) 
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sprint não encontrado");
        sprintRepository.deleteById(id);
    }
}