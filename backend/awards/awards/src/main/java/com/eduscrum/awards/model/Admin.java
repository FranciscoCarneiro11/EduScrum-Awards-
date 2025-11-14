package com.eduscrum.awards.model;

import com.fasterxml.jackson.annotation.JsonIgnoreType;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
@JsonIgnoreType
public class Admin extends Utilizador {
}


