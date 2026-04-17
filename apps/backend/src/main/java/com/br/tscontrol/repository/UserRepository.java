package com.br.tscontrol.repository;

import com.br.tscontrol.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailUsuario(String email);

    boolean existsByEmailUsuario(String email);
}