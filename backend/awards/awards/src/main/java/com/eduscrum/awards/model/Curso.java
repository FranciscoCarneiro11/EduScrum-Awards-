package com.eduscrum.awards.model;

import jakarta.persistence.*;

@Entity
@Table(name = "curso")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "admin_id")
    private Admin admin;


    // --- Getters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getCodigo() { return codigo; }
    public Admin getAdmin() { return admin; }

    // --- Setters
    public void setId(Long id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public void setAdmin(Admin admin) { this.admin = admin; }
}
