package com.vys.staff_evaluation_system.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_evaluations")
public class UserEvaluation {

    private String name; // Name of the user
    private int totalMarks; // Total marks
    private int achievementMarks; // Marks for performance
    private double average; // Achievement percentage
    private String remarks; // Custom remarks for the user

    public void calculateAverage() {
        if (totalMarks != 0) {
            this.average = (double) achievementMarks / totalMarks * 100;
            System.out.println("Average : " + average);
        } else {
            this.average = 0;
        }
    }

}
