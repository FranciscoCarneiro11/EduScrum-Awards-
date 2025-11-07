package com.eduscrum.awards.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.eduscrum.awards.model.Aluno;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {}
