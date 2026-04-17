package com.br.tscontrol.controller;

import com.br.tscontrol.dto.LoginDTO;
import com.br.tscontrol.dto.TokenResponseDTO;
import com.br.tscontrol.dto.UserRegistroDTO;
import com.br.tscontrol.dto.UserResponseDTO;
import com.br.tscontrol.model.User;
import com.br.tscontrol.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.br.tscontrol.service.TokenService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping("/registrar")
    public ResponseEntity<UserResponseDTO> registrar(@RequestBody @Valid UserRegistroDTO dto) {
        User userSave = userService.registerUser(dto);
        return ResponseEntity.status(201).body(new UserResponseDTO(userSave));
    }
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid LoginDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());

        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.gerarToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new TokenResponseDTO(token));
    }

}
