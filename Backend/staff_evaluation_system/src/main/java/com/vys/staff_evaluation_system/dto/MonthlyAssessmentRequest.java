package com.vys.staff_evaluation_system.dto;


import lombok.Data;

@Data
public class MonthlyAssessmentRequest {
    private String startDate; // Start date of the period (e.g., "2024-10-01")
    private String endDate;   // End date of the period (e.g., "2024-10-31")
    private String date;      // Specific date of the assessment (e.g., "2024-10-23")
    private double monthlyTarget;
    private Double achievedTarget;
}
