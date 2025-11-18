package com.eduscrum.awards.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembroEquipaDTO {
    private Long id;
    private Long idUtilizador;
    private String nomeUtilizador;
    private String emailUtilizador;
    private PapelScrum papelScrum;
    private LocalDateTime dataEntrada;
}
