package com.eduscrum.awards.service;

import com.eduscrum.awards.model.*;
import com.eduscrum.awards.repository.CursoRepository;
import com.eduscrum.awards.repository.ProjetoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final CursoRepository cursoRepository;

    public ProjetoService(ProjetoRepository projetoRepository,
                          CursoRepository cursoRepository) {
        this.projetoRepository = projetoRepository;
        this.cursoRepository = cursoRepository;
    }

    // POST /api/cursos/{id}/projetos
    public ProjetoDTO criarProjeto(Long cursoId, ProjetoRequestDTO dto) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Curso não encontrado"));

        Projeto projeto = new Projeto(
                dto.getNome(),
                dto.getDescricao(),
                curso,
                dto.getDataInicio(),
                dto.getDataFim()
        );

        Projeto guardado = projetoRepository.save(projeto);
        return toDTO(guardado);
    }

    // GET /api/cursos/{id}/projetos
    public List<ProjetoDTO> listarProjetosDoCurso(Long cursoId) {
        return projetoRepository.findByCursoId(cursoId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // GET /api/projetos/{id}
    public ProjetoDTO obterProjeto(Long projetoId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Projeto não encontrado"));

        return toDTO(projeto);
    }

    // PUT /api/projetos/{id}
    public ProjetoDTO atualizarProjeto(Long projetoId, ProjetoRequestDTO dto) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Projeto não encontrado"));

        projeto.setNome(dto.getNome());
        projeto.setDescricao(dto.getDescricao());
        projeto.setDataInicio(dto.getDataInicio());
        projeto.setDataFim(dto.getDataFim());

        Projeto atualizado = projetoRepository.save(projeto);
        return toDTO(atualizado);
    }

    // DELETE /api/projetos/{id}
    public void eliminarProjeto(Long projetoId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Projeto não encontrado"));

        projetoRepository.delete(projeto);
    }

    // conversão Entity -> DTO
    private ProjetoDTO toDTO(Projeto projeto) {
        return new ProjetoDTO(
                projeto.getId(),
                projeto.getNome(),
                projeto.getDescricao(),
                projeto.getDataInicio(),
                projeto.getDataFim(),
                projeto.getCurso() != null ? projeto.getCurso().getId() : null
        );
    }
}
