package com.eduscrum.awards.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eduscrum.awards.model.Curso;
import com.eduscrum.awards.model.PapelSistema;
import com.eduscrum.awards.model.ProfessorCurso;
import com.eduscrum.awards.model.Utilizador;
import com.eduscrum.awards.repository.CursoRepository;
import com.eduscrum.awards.repository.ProfessorCursoRepository;
import com.eduscrum.awards.repository.UtilizadorRepository;

@Service
public class ProfessorCursoService {

    private final ProfessorCursoRepository professorCursoRepository;
    private final UtilizadorRepository utilizadorRepository;
    private final CursoRepository cursoRepository;

    public ProfessorCursoService(ProfessorCursoRepository professorCursoRepository,UtilizadorRepository utilizadorRepository,CursoRepository cursoRepository) {
        this.professorCursoRepository = professorCursoRepository;
        this.utilizadorRepository = utilizadorRepository;
        this.cursoRepository = cursoRepository;
    }

    @Transactional
    public void adicionarProfessorAoCurso(Long professorId, Long cursoId) {

        Utilizador professor = utilizadorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        if (professor.getPapelSistema() != PapelSistema.PROFESSOR) {
            throw new RuntimeException("Utilizador não é um professor.");
        }

        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        if (professorCursoRepository.existsByProfessorId(professorId)) {
            throw new RuntimeException("O professor já está associado a um curso.");
        }

        ProfessorCurso professorCurso = new ProfessorCurso(professor, curso);
        professorCursoRepository.save(professorCurso);
    }

    @Transactional(readOnly = true)
    public List<Curso> listarCursosDoProfessor(Long professorId) {
        return professorCursoRepository.findByProfessorId(professorId)
                .stream()
                .map(ProfessorCurso::getCurso)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removerProfessorDoCurso(Long professorId, Long cursoId) {
        ProfessorCurso relacao = professorCursoRepository.findByProfessorIdAndCursoId(professorId, cursoId)
                .orElseThrow(() -> new RuntimeException("Associação professor-curso não encontrada."));

        professorCursoRepository.delete(relacao);
    }
}
