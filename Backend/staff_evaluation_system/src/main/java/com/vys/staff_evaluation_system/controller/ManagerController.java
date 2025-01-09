//package com.vys.staff_evaluation_system.controller;
//
//import com.vys.staff_evaluation_system.dto.UpdateMemberRequest;
//import com.vys.staff_evaluation_system.dto.UserProfileResponse;
//import com.vys.staff_evaluation_system.entity.*;
//import com.vys.staff_evaluation_system.service.DepartmentService;
//import com.vys.staff_evaluation_system.service.EvaluationService;
//import com.vys.staff_evaluation_system.service.MonthlyAssessmentService;
//import com.vys.staff_evaluation_system.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.net.URLDecoder;
//import java.nio.charset.StandardCharsets;
//import java.security.Principal;
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/v1/manager")
//public class ManagerController {
//
//    @Autowired
//    private DepartmentService departmentService;
//
//    @Autowired
//    private MonthlyAssessmentService monthlyAssessmentService;
//
//    @Autowired
//    private UserService userService;
//
//    // Managers can view the department list (read-only access)
//    @PreAuthorize("hasRole('MANAGER')")
//    @GetMapping("/departments")
//    public List<Department> getDepartments() {
//        return departmentService.getAllDepartments();
//    }
//    @GetMapping("/department-users")
//    public Map<String, List<UserProfileResponse>> getDepartmentUsers() {
//        return userService.getUsersCategorizedByDepartment();
//    }
//    @GetMapping("/profile")
//    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
//        // Fetch the authenticated user using the principal
//        User user = userService.findByEmail(principal.getName());
//
//        // If user is found, return the profile data
//        if (user != null) {
//            UserProfileResponse profile = new UserProfileResponse(
//                    user.getId(),
//                    user.getName(),
//                    user.getEmail(),
//                    user.getRole(),
//                    user.getDepName()  // Return the dep_name directly
//            );
//            return ResponseEntity.ok(profile);
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//    // Get all assessments - Accessible to MANAGER
//    @PreAuthorize("hasRole('MANAGER')")
//    @GetMapping("/assessment")
//    public ResponseEntity<List<MonthlyAssessment>> getAllAssessments() {
//        return ResponseEntity.ok(monthlyAssessmentService.getAllAssessments());
//    }
//
//    // Get an assessment by ID - Accessible to MANAGER
//    @PreAuthorize("hasRole('MANAGER')")
//    @GetMapping("assessment/{id}")
//    public ResponseEntity<MonthlyAssessment> getAssessmentById(@PathVariable String id) {
//        Optional<MonthlyAssessment> assessment = monthlyAssessmentService.getAssessmentById(id);
//        return assessment.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    @Autowired
//    private EvaluationService evaluationService;
//
//    @PostMapping("/evaluation")
//    public Evaluation addEvaluation(@RequestBody Evaluation evaluation, Principal principal) {
//        // Set the assessor (manager) for the evaluation
//        evaluation.setAssessor(principal.getName());
//
//        // Calculate the average for each user's evaluation
//        evaluation.getDepartments().forEach(department -> {
//            department.getMembers().forEach(userEvaluation -> {
//                userEvaluation.calculateAverage();
//            });
//        });
//
//        // Save the evaluation and return the saved entity
//        return evaluationService.saveEvaluation(evaluation);
//    }
//
//    @PreAuthorize("hasRole('MANAGER')")
//    @GetMapping("/evaluations")
//    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
//        List<Evaluation> evaluations = evaluationService.fetchAllEvaluations();
//        return ResponseEntity.ok(evaluations);
//
//    }
//
////    @GetMapping("/evaluation/{id}")
////    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable String id) {
////        return evaluationService.fetchEvaluationById(id)
////                .map(ResponseEntity::ok)
////                .orElseGet(() -> ResponseEntity.notFound().build());
////    }
//
//    @PreAuthorize("hasRole('MANAGER')")
//    @GetMapping("/evaluation/{period}")
//    public ResponseEntity<List<Evaluation>> getEvaluationByPeriod(@PathVariable String period) {
//        // Example of decoding the period if needed
//        String decodedPeriod = URLDecoder.decode(period, StandardCharsets.UTF_8);
//        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(decodedPeriod);
//        if (evaluations.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        } else {
//            return ResponseEntity.ok(evaluations);
//        }
//    }
//
//
//    @GetMapping("/evaluation-report")
//    public ResponseEntity<String> generateEvaluationReport(@RequestParam String period) {
//        // Fetch evaluations by period using the service
//        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(period);
//
//        if (evaluations.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No evaluations found for the given period.");
//        }
//
//        // Start building the report
//        StringBuilder report = new StringBuilder();
//        report.append("Personal Assessment Report\n")
//                .append("Date: ").append(LocalDate.now()).append("\n")
//                .append("Assessor: ").append(evaluations.get(0).getAssessor()).append("\n");
//        //.append("Period: ").append(period).append("\n\n");
//
//        // Loop through each evaluation and its departments
//        for (Evaluation evaluation : evaluations) {
//            for (Department department : evaluation.getDepartments()) {
//                report.append("Department: ").append(department.getDep_name()).append("\n");
//
//                // Loop through each member in the department
//                for (UserEvaluation member : department.getMembers()) {
//                    report.append("Person: ").append(member.getName()).append("\n")
//                            .append("Total Marks: ").append(member.getTotalMarks()).append("\n")
//                            .append("Achievement Marks: ").append(member.getAchievementMarks()).append("\n")
//                            // .append("Average Team Achievement: ").append(member.getAverageAchievement()).append("\n")
//                            .append("Average Team Mark: ").append(department.getTeamValues().getAverageTeamMark()).append("\n")
//                            .append("Remarks: ").append(member.getRemarks()).append("\n");
//                }
//
//                Department.TeamValues teamValues = department.getTeamValues();
//                report.append("Team Values:\n")
//                        .append("Total Marks: ").append(teamValues.getTotalMarks()).append("\n")
//                        .append("Achievement Marks: ").append(teamValues.getAchievementMarks()).append("\n")
//                        .append("Average Achievement: ").append(teamValues.getFormattedAverageAchievement()).append("\n") // Use formatted method
//                        .append("Average Team Mark: ").append(teamValues.getAverageTeamMark()).append("\n\n");
//            }
//        }
//
//        // Return the generated report after looping through all evaluations and departments
//        return ResponseEntity.ok(report.toString());
//    }
//    @PutMapping("/{evaluationId}")
//    public ResponseEntity<Evaluation> updateEvaluation(
//            @PathVariable String evaluationId,
//            @RequestBody UpdateMemberRequest request
//    ) {
//        Evaluation updatedEvaluation = evaluationService.updateEvaluation(evaluationId, request);
//        return ResponseEntity.ok(updatedEvaluation);
//    }
//}
package com.vys.staff_evaluation_system.controller;

import com.vys.staff_evaluation_system.dto.UserProfileResponse;
import com.vys.staff_evaluation_system.entity.*;
import com.vys.staff_evaluation_system.service.DepartmentService;
import com.vys.staff_evaluation_system.service.EvaluationService;
import com.vys.staff_evaluation_system.service.MonthlyAssessmentService;
import com.vys.staff_evaluation_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/manager")
public class ManagerController {

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private MonthlyAssessmentService monthlyAssessmentService;

    @Autowired
    private UserService userService;

    // Managers can view the department list (read-only access)
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/departments")
    public List<Department> getDepartments() {
        return departmentService.getAllDepartments();
    }
    @GetMapping("/department-users")
    public Map<String, List<UserProfileResponse>> getDepartmentUsers() {
        return userService.getUsersCategorizedByDepartment();
    }
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
        // Fetch the authenticated user using the principal
        User user = userService.findByEmail(principal.getName());

        // If user is found, return the profile data
        if (user != null) {
            UserProfileResponse profile = new UserProfileResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getDepName()  // Return the dep_name directly
            );
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    // Get all assessments - Accessible to MANAGER
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/assessment")
    public ResponseEntity<List<MonthlyAssessment>> getAllAssessments() {
        return ResponseEntity.ok(monthlyAssessmentService.getAllAssessments());
    }

    // Get an assessment by ID - Accessible to MANAGER
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("assessment/{id}")
    public ResponseEntity<MonthlyAssessment> getAssessmentById(@PathVariable String id) {
        Optional<MonthlyAssessment> assessment = monthlyAssessmentService.getAssessmentById(id);
        return assessment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping("/evaluation")
    public Evaluation addEvaluation(@RequestBody Evaluation evaluation, Principal principal) {
        // Set the assessor (manager) for the evaluation
        evaluation.setAssessor(principal.getName());

        // Calculate the average for each user's evaluation
        evaluation.getDepartments().forEach(department -> {
            department.getMembers().forEach(userEvaluation -> {
                userEvaluation.calculateAverage();
            });
        });

        // Save the evaluation and return the saved entity
        return evaluationService.saveEvaluation(evaluation);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/evaluations")
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationService.fetchAllEvaluations();
        return ResponseEntity.ok(evaluations);

    }

//    @GetMapping("/evaluation/{id}")
//    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable String id) {
//        return evaluationService.fetchEvaluationById(id)
//                .map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/evaluation/{period}")
    public ResponseEntity<List<Evaluation>> getEvaluationByPeriod(@PathVariable String period) {
        // Example of decoding the period if needed
        String decodedPeriod = URLDecoder.decode(period, StandardCharsets.UTF_8);
        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(decodedPeriod);
        if (evaluations.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(evaluations);
        }
    }


    @GetMapping("/evaluation-report")
    public ResponseEntity<String> generateEvaluationReport(@RequestParam String period) {
        // Fetch evaluations by period using the service
        List<Evaluation> evaluations = evaluationService.fetchEvaluationByPeriod(period);

        if (evaluations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No evaluations found for the given period.");
        }

        // Start building the report
        StringBuilder report = new StringBuilder();
        report.append("Personal Assessment Report\n")
                .append("Date: ").append(LocalDate.now()).append("\n")
                .append("Assessor: ").append(evaluations.get(0).getAssessor()).append("\n");
        //.append("Period: ").append(period).append("\n\n");

        // Loop through each evaluation and its departments
        for (Evaluation evaluation : evaluations) {
            for (Department department : evaluation.getDepartments()) {
                report.append("Department: ").append(department.getDep_name()).append("\n");

                // Loop through each member in the department
                for (UserEvaluation member : department.getMembers()) {
                    report.append("Person: ").append(member.getName()).append("\n")
                            .append("Total Marks: ").append(member.getTotalMarks()).append("\n")
                            .append("Achievement Marks: ").append(member.getAchievementMarks()).append("\n")
                            // .append("Average Team Achievement: ").append(member.getAverageAchievement()).append("\n")
                            .append("Average Team Mark: ").append(department.getTeamValues().getAverageTeamMark()).append("\n")
                            .append("Remarks: ").append(member.getRemarks()).append("\n");
                }

                Department.TeamValues teamValues = department.getTeamValues();
                report.append("Team Values:\n")
                        .append("Total Marks: ").append(teamValues.getTotalMarks()).append("\n")
                        .append("Achievement Marks: ").append(teamValues.getAchievementMarks()).append("\n")
                        .append("Average Achievement: ").append(teamValues.getFormattedAverageAchievement()).append("\n") // Use formatted method
                        .append("Average Team Mark: ").append(teamValues.getAverageTeamMark()).append("\n\n");
            }
        }

        // Return the generated report after looping through all evaluations and departments
        return ResponseEntity.ok(report.toString());
    }
}
