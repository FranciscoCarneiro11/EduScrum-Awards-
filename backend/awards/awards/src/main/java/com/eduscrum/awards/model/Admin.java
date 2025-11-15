package com.eduscrum.awards.model;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnoreType;

=======
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
>>>>>>> e54b788 (Adiciona módulo completo de disciplinas e atualiza Admin e Curso para criar disciplinas dentro do curso  com melhorias e ajustes)
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "admin")
@JsonIgnoreType
public class Admin extends Utilizador {
}

