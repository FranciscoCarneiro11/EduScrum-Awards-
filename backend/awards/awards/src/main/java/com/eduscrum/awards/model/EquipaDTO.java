package com.eduscrum.awards.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EquipaDTO {
    private Long id;
    private String nome;
    private Long idProjeto;
}
