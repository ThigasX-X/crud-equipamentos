package com.br.tscontrol.dto;

import com.br.tscontrol.model.User;
import com.br.tscontrol.model.StatusUser;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String nome,
        String email,
        StatusUser status
) {
    public UserResponseDTO(User user) {
        this(user.getId(), user.getNomeUsuario(), user.getEmailUsuario(), user.getStatus());
    }
}