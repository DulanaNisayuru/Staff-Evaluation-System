package com.vys.staff_evaluation_system.auth;

import com.vys.staff_evaluation_system.entity.Role;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class RegisterRequest {

    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private String dep_name;

}
