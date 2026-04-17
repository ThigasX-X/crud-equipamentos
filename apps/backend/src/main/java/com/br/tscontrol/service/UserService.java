package com.br.tscontrol.service;

import com.br.tscontrol.dto.UserRegistroDTO;
import com.br.tscontrol.model.User;
import com.br.tscontrol.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User searchByEmail(String email) {
        return userRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o e-mail" + email));
    }

    @Transactional
    public User registerUser(UserRegistroDTO userDTO) {
        if (userRepository.existsByEmailUsuario(userDTO.email())) {
            throw new RuntimeException("E-mail já cadastrado!");
        }

        User newUser = new User();
        newUser.setNomeUsuario(userDTO.nome());
        newUser.setEmailUsuario(userDTO.email());
        newUser.setDataNascimento(userDTO.dataNascimento());

        String passwordCrypto = passwordEncoder.encode(userDTO.senha());
        newUser.setSenhaUsuario(passwordCrypto);

        return userRepository.save(newUser);
    }
}
