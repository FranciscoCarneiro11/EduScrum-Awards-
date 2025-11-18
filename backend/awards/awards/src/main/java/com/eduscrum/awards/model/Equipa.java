package com.eduscrum.awards.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipa")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Equipa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_projeto")
    private Projeto projeto; 

    @OneToMany(mappedBy = "equipa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MembroEquipa> membros = new ArrayList<>();
}
