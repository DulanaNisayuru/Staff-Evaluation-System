package com.vys.staff_evaluation_system.entity;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

//package com.vys.staff_evaluation_system.entity;
//
//import jakarta.persistence.Id;
//import lombok.*;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Getter
//@Setter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@Document(collection = "evaluations")
//public class Evaluation {
//
//    @Id
//    private String id; // Unique ID
//    private String period; // e.g., "1st Oct - 31st Oct"
//    private String dep_name; // Department being evaluated
//    private String assessor; // Name of the logged-in manager
//    private LocalDate date; // Date of the evaluation
//    private List<UserEvaluation> evaluations; // List of user evaluations for the department
//    private double averageTeamAchievement; // Calculated as total marks / achievement marks
//    private double averageTeamMark; // Team average marks
//    private double totalAchievement;
//    private double teamTotalMark;
//
//
//}
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "evaluations")
public class Evaluation {

    @Id
    private String id; // Unique ID
    private String period; // e.g., "1st Oct - 31st Oct"
    private String assessor; // Name of the evaluator
    private LocalDate date; // Evaluation date
    private List<Department> departments;

    @Override
    public String toString() {
        return "Evaluation{" +
                "id='" + id + '\'' +
                ", period='" + period + '\'' +
                ", assessor='" + assessor + '\'' +
                ", date=" + date +
                ", departments=" + departments +
                '}';
    }// Nested department evaluations
}
