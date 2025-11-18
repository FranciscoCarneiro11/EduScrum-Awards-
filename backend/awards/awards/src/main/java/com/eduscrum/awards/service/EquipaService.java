package com.eduscrum.awards.service;

import com.eduscrum.awards.model.*;
import com.eduscrum.awards.repository.*;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class EquipaService {

    private final EquipaRepository equipaRepository;
    private final MembroEquipaRepository membroEquipaRepository;
    private final ProjetoRepository projetoRepository;
    private final UtilizadorRepository utilizadorRepository;

    public EquipaService(EquipaRepository equipaRepository,
                         MembroEquipaRepository membroEquipaRepository,
                         ProjetoRepository projetoRepository,
                         UtilizadorRepository utilizadorRepository) {

        this.equipaRepository = equipaRepository;
        this.membroEquipaRepository = membroEquipaRepository;
        this.projetoRepository = projetoRepository;
        this.utilizadorRepository = utilizadorRepository;
    }

    // ------------------------
    // EQUIPAS
    // ------------------------
    public List<EquipaDTO> listar() {
        return equipaRepository.findAll()
                .stream()
                .map(this::toDTO)   // toDTO(Equipa)
                .toList();
    }

    public EquipaDTO obter(Long id) {
        return toDTO(findEquipa(id));
    }

    public EquipaDTO criar(EquipaCreateDTO dto) {

        if (equipaRepository.existsByNome(dto.getNome())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome já existe");
        }

        Equipa e = new Equipa();
        e.setNome(dto.getNome());

        if (dto.getIdProjeto() != null) {
            Projeto p = projetoRepository.findById(dto.getIdProjeto())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto não encontrado"));
            e.setProjeto(p);
        }

        e = equipaRepository.save(e);
        return toDTO(e);
    }

    public EquipaDTO atualizar(Long id, EquipaUpdateDTO dto) {

        Equipa e = findEquipa(id);

        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            e.setNome(dto.getNome());
        }

        if (dto.getIdProjeto() != null) {
            Projeto p = projetoRepository.findById(dto.getIdProjeto())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto não encontrado"));
            e.setProjeto(p);
        } else {
            e.setProjeto(null); // se quiseres desligar o projeto
        }

        e = equipaRepository.save(e);
        return toDTO(e);
    }

    public void apagar(Long id) {
        Equipa e = findEquipa(id);
        equipaRepository.delete(e);
    }

    // ------------------------
    // MEMBROS
    // ------------------------
    public List<MembroEquipaDTO> listarMembros(Long idEquipa) {

        // só para garantir que a equipa existe
        findEquipa(idEquipa);

        return membroEquipaRepository.findByEquipaId(idEquipa)
                .stream()
                .map(this::toDTO)   // toDTO(MembroEquipa)
                .toList();
    }

    public MembroEquipaDTO adicionarMembro(Long idEquipa, MembroEquipaCreateDTO dto) {

        Equipa equipa = findEquipa(idEquipa);

        Utilizador utilizador = utilizadorRepository.findById(dto.getIdUtilizador())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilizador não encontrado"));

        if (membroEquipaRepository.existsByEquipaIdAndUtilizadorId(idEquipa, dto.getIdUtilizador())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Utilizador já pertence à equipa");
        }

        MembroEquipa me = new MembroEquipa();
        me.setEquipa(equipa);
        me.setUtilizador(utilizador);

        // DTO usa com.eduscrum.awards.model.PapelScrum
        // Entidade usa MembroEquipa.PapelScrum -> converter
        if (dto.getPapelScrum() != null) {
            me.setPapelScrum(
                    MembroEquipa.PapelScrum.valueOf(dto.getPapelScrum().name())
            );
        }

        me.setDataEntrada(java.time.LocalDateTime.now());

        me = membroEquipaRepository.save(me);
        return toDTO(me);
    }

    public void removerMembro(Long idEquipa, Long idUtilizador) {

        // garantir que a equipa existe
        findEquipa(idEquipa);

        MembroEquipa me = membroEquipaRepository
                .findByEquipaIdAndUtilizadorId(idEquipa, idUtilizador)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Membro não encontrado"));

        membroEquipaRepository.delete(me);
    }

    // ------------------------
    // CONVERSÕES PARA DTO (SEM MAPPER)
    // ------------------------
    private EquipaDTO toDTO(Equipa e) {
        if (e == null) return null;

        Long idProjeto = (e.getProjeto() == null) ? null : e.getProjeto().getId();

        return new EquipaDTO(
                e.getId(),
                e.getNome(),
                idProjeto
        );
    }

    private MembroEquipaDTO toDTO(MembroEquipa me) {
        if (me == null) return null;

        Utilizador u = me.getUtilizador();

        // Entidade -> enum interno MembroEquipa.PapelScrum
        // DTO -> enum PapelScrum (ficheiro separado) -> converter
        PapelScrum papelDTO = null;
        if (me.getPapelScrum() != null) {
            papelDTO = PapelScrum.valueOf(me.getPapelScrum().name());
        }

        return new MembroEquipaDTO(
                me.getId(),
                u.getId(),
                u.getNome(),
                u.getEmail(),
                papelDTO,
                me.getDataEntrada()
        );
    }

    // ------------------------
    // AUX
    // ------------------------
    private Equipa findEquipa(Long id) {
        return equipaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipa não encontrada"));
    }
}
