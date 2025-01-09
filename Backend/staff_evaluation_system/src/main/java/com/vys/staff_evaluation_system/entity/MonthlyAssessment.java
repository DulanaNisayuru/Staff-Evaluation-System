package com.vys.staff_evaluation_system.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "monthly_assessment")
public class MonthlyAssessment {

    @Id
    private String id;
    private String period; // This will hold a generated value like "1st Oct - 31st Oct"
    @JsonFormat(pattern = "yyyy-MMM-dd") // This ensures proper formatting during JSON serialization
    private String date; // Date as a String in yyyy-MM-dd format
    private double monthlyTarget; // Target value for the month
    private Double achievedTarget;


    // Convenience constructor
    public MonthlyAssessment(String period, double monthlyTarget, Double achievedTarget) {
        this.period = period;
        this.date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MMM-dd"));
        this.monthlyTarget = monthlyTarget;
        this.achievedTarget = achievedTarget;
    }

    /**
     * Utility method to generate the period string from start and end dates.
     */
    public static String generatePeriod(LocalDate startDate, LocalDate endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MMM-dd");
        return startDate.format(formatter) + " to " + endDate.format(formatter);
    }

    @Override
    public String toString() {
        return "MonthlyAssessment{" +
                "id='" + id + '\'' +
                ", period='" + period + '\'' +
                ", date=" + date +
                ", monthlyTarget=" + monthlyTarget +
                ", achievedTarget=" + achievedTarget +
                '}';
    }
}
