package com.eduscrum.awards.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilizadorDTO {

    private String nome;
    private String email;
    private String password;
    private PapelSistema papelSistema;
}
