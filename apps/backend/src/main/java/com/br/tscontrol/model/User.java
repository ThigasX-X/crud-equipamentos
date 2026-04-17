package com.br.tscontrol.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "FIN_USER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_usuario", nullable = false)
    private String nomeUsuario;

    @Column(name = "email_usuario", unique = true, nullable = false)
    private String emailUsuario;

    @Column(name = "senha_usuario")
    private String senhaUsuario;

    @Column(name = "DATA_NASCIMENTO")
    private LocalDate dataNascimento;

    @Column(nullable = false, updatable = false)
    private LocalDate criadoEm;

    @Column(name = "ULTIMO_LOGIN")
    private LocalDate ultimoLogin;

    @Override
    public Collection<? extends GrantedAuthority>  getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.senhaUsuario;
    }

    @Override
    public String getUsername() {
        return this.emailUsuario;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Enumerated(EnumType.STRING)
    private StatusUser status = StatusUser.PENDENTE_CONFIRMACAO;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Conta> contas;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDate.now();
    }

}
