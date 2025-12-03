package com.eduscrum.awards.service;

import com.eduscrum.awards.model.*;
import com.eduscrum.awards.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
@Transactional
public class GamificacaoService {

    private final PremioRepository premioRepository;
    private final ConquistaRepository conquistaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;

    public GamificacaoService(PremioRepository premioRepository, ConquistaRepository conquistaRepository, AlunoRepository alunoRepository, DisciplinaRepository disciplinaRepository) {
        this.premioRepository = premioRepository;
        this.conquistaRepository = conquistaRepository;
        this.alunoRepository = alunoRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    // --- Gestão de Prémios ---

    public Premio criarPremio(Long disciplinaId, PremioDTO dto) {
        Disciplina d = disciplinaRepository.findById(disciplinaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));

        Premio p = new Premio();
        p.setNome(dto.nome);
        p.setDescricao(dto.descricao);
        p.setValorPontos(dto.valorPontos);
        p.setTipo(Premio.TipoPremio.valueOf(dto.tipo)); 
        p.setDisciplina(d);

        return premioRepository.save(p);
    }

    public List<Premio> listarPremiosDaDisciplina(Long disciplinaId) {
        return premioRepository.findByDisciplinaId(disciplinaId);
    }

    // --- Atribuição e Pontuação ---

    public void atribuirPremio(Long premioId, Long alunoId) {
        Premio premio = premioRepository.findById(premioId)
            .orElseThrow(() -> new RuntimeException("Prémio não encontrado"));

        Aluno aluno = alunoRepository.findById(alunoId)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        // 1. Registar a conquista
        Conquista conquista = new Conquista(aluno, premio);
        conquistaRepository.save(conquista);

        // 2. Atualizar pontuação global do aluno
        int novaPontuacao = aluno.getTotalPontos() + premio.getValorPontos();
        aluno.setTotalPontos(novaPontuacao);
        alunoRepository.save(aluno);
    }
    
    public List<Conquista> listarConquistasDoAluno(Long alunoId) {
        return conquistaRepository.findByAlunoId(alunoId);
    }
}