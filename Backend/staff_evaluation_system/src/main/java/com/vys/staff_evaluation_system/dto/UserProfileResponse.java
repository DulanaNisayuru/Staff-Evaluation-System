package com.vys.staff_evaluation_system.dto;

import com.vys.staff_evaluation_system.entity.Role;

public class UserProfileResponse {
    private String id;
    private String name;
    private String email;
    private Role role;
    private String dep_name;

    // Constructor
    public UserProfileResponse(String id, String name, String email, Role role, String dep_name) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.dep_name = dep_name;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getDep_name() { return dep_name; }
    public void setDep_name(String dep_name) { this.dep_name = dep_name; }
}
