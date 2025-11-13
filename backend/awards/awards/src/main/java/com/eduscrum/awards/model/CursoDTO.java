package com.eduscrum.awards.model;


public class CursoDTO {
    public String nome;
    public String codigo;
    public Long adminId; // ID do admin que cria o curso


//setters
    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }
}
