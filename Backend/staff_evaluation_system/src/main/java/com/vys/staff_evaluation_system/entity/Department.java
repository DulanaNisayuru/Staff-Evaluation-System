package com.vys.staff_evaluation_system.entity;

import com.vys.staff_evaluation_system.entity.UserEvaluation;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "departments")


public class Department {

    @Id
    private String id;
    private String dep_name; // Department name

    @Field("members")
    private List<UserEvaluation> members; // List of team members

    @Field("teamValues")
    private TeamValues teamValues; // Aggregated team values for the department

    // Inner class for Team Values
    @Data
    public static class TeamValues {
        private int totalMarks;
        private int achievementMarks;
        private double averageAchievement; // e.g., "60%"
        private double averageTeamMark;
        private String formattedAverageAchievement;

        public void setFormattedAverageAchievement(String formattedAverageAchievement) {
            this.formattedAverageAchievement = formattedAverageAchievement;
            // Remove '%' symbol and parse the number
            if (formattedAverageAchievement != null && !formattedAverageAchievement.isEmpty()) {
                String valueWithoutPercent = formattedAverageAchievement.replace("%", "");
                try {
                    this.averageAchievement = Double.parseDouble(valueWithoutPercent);
                } catch (NumberFormatException e) {
                    // Handle the exception (log, default value, etc.)
                    this.averageAchievement = 0.0; // Default value in case of error
                    // Log error if necessary
                    System.out.println("Error parsing average achievement: " + e.getMessage());
                }
            } else {
                this.averageAchievement = 0.0; // Default value if the string is null or empty
            }
        }
    }}
