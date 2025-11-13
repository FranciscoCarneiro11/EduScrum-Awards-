package com.eduscrum.awards.model;

public class CursoResponseDTO {
    public Long id;
    public String nome;
    public String codigo;
    public Long adminId;

    public CursoResponseDTO(Long id, String nome, String codigo, Long adminId) {
        this.id = id;
        this.nome = nome;
        this.codigo = codigo;
        this.adminId = adminId;
    }
}

