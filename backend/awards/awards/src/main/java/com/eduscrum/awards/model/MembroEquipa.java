package com.eduscrum.awards.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "membro_equipa",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"equipa_id", "utilizador_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
public class MembroEquipa {

    public enum PapelScrum {
        DEV, PO, SM
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipa_id", nullable = false)
    private Equipa equipa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "utilizador_id", nullable = false)
    private Utilizador utilizador;

    @Enumerated(EnumType.STRING)
    @Column(name = "papel_scrum", nullable = false)
    private PapelScrum papelScrum;

    @Column(name = "data_entrada", nullable = false)
    private LocalDateTime dataEntrada;
}
