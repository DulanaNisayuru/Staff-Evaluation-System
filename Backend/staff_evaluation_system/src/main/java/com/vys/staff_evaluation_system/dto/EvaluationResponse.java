package com.vys.staff_evaluation_system.dto;

import java.util.List;

// EvaluationResponse DTO
public class EvaluationResponse {
    private String date;
    private String period;
    private String assessor;
    private List<DepartmentResponse> departments;
    private double averageAchievement;
    private double averageTeamMark;

    // Constructor, getters, and setters
}
