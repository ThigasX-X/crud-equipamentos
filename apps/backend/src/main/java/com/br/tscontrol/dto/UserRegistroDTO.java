package com.br.tscontrol.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record UserRegistroDTO(
        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @Email(message = "E-mail inválido")
        @NotBlank(message = "O e-mail é obrigatório")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String senha,

        @NotNull(message = "Data de nascimento é obrigatória")
        LocalDate dataNascimento
) {

}